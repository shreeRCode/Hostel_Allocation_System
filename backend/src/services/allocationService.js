const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fallback logic
function getFallback(gender, primary) {
  if (gender === "FEMALE") return primary === "Alpha" ? "Gamma" : "Alpha";
  if (gender === "MALE") return primary === "Beta" ? "Gamma" : "Beta";
  return null;
}

// ✅ FIXED: Export as an object with runAllocation function
async function runAllocation() {
  const students = await prisma.student.findMany({
    where: {
      allocations: {
        none: { active: true },
      },
    },
  });

  let allocated = 0;

  for (const s of students) {
    const primary = s.preferredHostel;
    const fallback = getFallback(s.gender, primary);

    // Try primary hostel first
    let room = await prisma.room.findFirst({
      where: {
        hostel: { name: primary },
        occupiedCount: { lt: prisma.room.fields.capacity },
      },
    });

    // Try fallback if primary is full
    if (!room && fallback) {
      room = await prisma.room.findFirst({
        where: {
          hostel: { name: fallback },
          occupiedCount: { lt: prisma.room.fields.capacity },
        },
      });
    }

    if (!room) continue; // Skip if no room available

    // Allocate the room
    await prisma.$transaction(async (tx) => {
      await tx.allocation.create({
        data: {
          studentId: s.id,
          roomId: room.id,
          active: true,
        },
      });

      await tx.room.update({
        where: { id: room.id },
        data: { occupiedCount: { increment: 1 } },
      });
    });

    allocated++;
  }

  return {
    success: true,
    message: `Allocated ${allocated} out of ${students.length} students.`,
    allocated,
    total: students.length,
  };
}

// ✅ FIXED: Export the function properly
module.exports = { runAllocation };

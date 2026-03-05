const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// -------------------------------------
// Hostel fallback logic
// -------------------------------------
function getFallback(gender, primary) {
  if (gender === "FEMALE") return primary === "Alpha" ? "Gamma" : "Alpha";
  if (gender === "MALE") return primary === "Beta" ? "Gamma" : "Beta";
  return null;
}

// -------------------------------------
// RUN ALLOCATION
// -------------------------------------
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
    if (!primary) continue;

    const fallback = getFallback(s.gender, primary);

    let room = null;

    // -------------------------------------
    // Try PRIMARY hostel
    // -------------------------------------
    const primaryRooms = await prisma.room.findMany({
      where: {
        hostel: {
          is: { name: primary },
        },
      },
      include: { hostel: true },
    });

    room = primaryRooms.find((r) => r.occupiedCount < r.capacity);

    // -------------------------------------
    // Try FALLBACK hostel
    // -------------------------------------
    if (!room && fallback) {
      const fallbackRooms = await prisma.room.findMany({
        where: {
          hostel: {
            is: { name: fallback },
          },
        },
        include: { hostel: true },
      });

      room = fallbackRooms.find((r) => r.occupiedCount < r.capacity);
    }

    // No room available
    if (!room) continue;

    // -------------------------------------
    // Transaction
    // -------------------------------------
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
        data: {
          occupiedCount: { increment: 1 },
        },
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

module.exports = { runAllocation };

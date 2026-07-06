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

  // Load every room ONCE and index by hostel name, instead of re-querying the
  // DB for each student (previously an N+1 query pattern). We track occupancy
  // in memory so students allocated earlier in this run correctly fill rooms
  // before we consider them full.
  const allRooms = await prisma.room.findMany({ include: { hostel: true } });
  const roomsByHostel = new Map();
  for (const room of allRooms) {
    const key = room.hostel?.name;
    if (!key) continue;
    if (!roomsByHostel.has(key)) roomsByHostel.set(key, []);
    roomsByHostel.get(key).push(room);
  }

  const findOpenRoom = (hostelName) => {
    const rooms = roomsByHostel.get(hostelName);
    if (!rooms) return null;
    return rooms.find((r) => r.occupiedCount < r.capacity) || null;
  };

  let allocated = 0;

  for (const s of students) {
    const primary = s.preferredHostel;
    if (!primary) continue;

    const fallback = getFallback(s.gender, primary);

    let room = findOpenRoom(primary);
    if (!room && fallback) {
      room = findOpenRoom(fallback);
    }

    // No room available
    if (!room) continue;

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

    // Reflect the new occupancy in our in-memory copy for the rest of the run.
    room.occupiedCount += 1;
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

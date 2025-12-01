const prisma = require("../config/prisma");

// ------------------------
// Fallback Logic
// ------------------------
function getFallback(gender, primary) {
  if (gender === "FEMALE") {
    // Female → only Beta & Gamma exist
    return primary === "Beta" ? "Gamma" : "Beta";
  }

  if (gender === "MALE") {
    // Male → only Alpha & Gamma exist
    return primary === "Alpha" ? "Gamma" : "Alpha";
  }

  return null;
}

// ------------------------
// Assign Room Helper
// ------------------------
async function assignStudentToRoom(student, room) {
  await prisma.allocation.create({
    data: {
      studentId: student.id,
      roomId: room.id,
      active: true,
      allocatedAt: new Date(),
    },
  });

  await prisma.room.update({
    where: { id: room.id },
    data: { currentOccupancy: { increment: 1 } },
  });

  await prisma.student.update({
    where: { id: student.id },
    data: { allocated: true },
  });
}

// ------------------------
// Allocation Main Function
// ------------------------
module.exports.runAllocation = async function () {
  const students = await prisma.student.findMany({
    where: { allocated: false },
    orderBy: { createdAt: "asc" }, // priority: earliest registration
  });

  let assigned = 0;

  for (const student of students) {
    const primary = student.preferredHostel; // Alpha/Beta/Gamma
    const fallback = getFallback(student.gender, primary);

    // ------------------------
    // Try Primary Hostel
    // ------------------------
    let room = await prisma.room.findFirst({
      where: {
        hostelName: primary,
        currentOccupancy: { lt: prisma.room.fields.capacity },
      },
    });

    if (room) {
      await assignStudentToRoom(student, room);
      assigned++;
      continue;
    }

    // ------------------------
    // Try Fallback Hostel
    // ------------------------
    room = await prisma.room.findFirst({
      where: {
        hostelName: fallback,
        currentOccupancy: { lt: prisma.room.fields.capacity },
      },
    });

    if (room) {
      await assignStudentToRoom(student, room);
      assigned++;
      continue;
    }

    // If no room in primary OR fallback → leave unallocated
  }

  return {
    summary: {
      assigned,
      unassigned: students.length - assigned,
    },
  };
};

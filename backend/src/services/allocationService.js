const prisma = require('../config/prisma');

const runAllocation = async () => {
  try {
    // Get unallocated students
    const unallocatedStudents = await prisma.student.findMany({
      where: {
        allocations: {
          none: { active: true }
        }
      },
      orderBy: [
        { disciplineScore: 'desc' },
        { year: 'asc' }
      ]
    });

    // Get available rooms
    const availableRooms = await prisma.room.findMany({
      where: {
        currentOccupancy: {
          lt: prisma.room.fields.capacity
        }
      },
      include: {
        hostel: true
      },
      orderBy: [
        { hostel: { distance: 'asc' } }
      ]
    });

    let assigned = 0;
    const allocations = [];

    for (const student of unallocatedStudents) {
      // Find suitable room based on gender and availability
      const suitableRoom = availableRooms.find(room => 
        room.hostel.genderAllowed === student.gender && 
        room.currentOccupancy < room.capacity
      );

      if (suitableRoom) {
        // Create allocation
        const allocation = await prisma.allocation.create({
          data: {
            studentId: student.id,
            roomId: suitableRoom.id
          }
        });

        // Update room occupancy
        await prisma.room.update({
          where: { id: suitableRoom.id },
          data: {
            currentOccupancy: {
              increment: 1
            }
          }
        });

        // Update available rooms array
        suitableRoom.currentOccupancy += 1;
        
        allocations.push(allocation);
        assigned++;
      }
    }

    const remainingStudents = unallocatedStudents.length - assigned;
    const remainingRooms = availableRooms.filter(room => 
      room.currentOccupancy < room.capacity
    ).length;

    return {
      message: 'Allocation run completed',
      summary: {
        assigned,
        remainingStudents,
        remainingRooms
      }
    };
  } catch (error) {
    throw new Error(`Allocation failed: ${error.message}`);
  }
};

module.exports = { runAllocation };
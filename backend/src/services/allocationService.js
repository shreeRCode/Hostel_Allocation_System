const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AllocationService {
  async allocateRooms() {
    try {
      // Get all unallocated students
      const unallocatedStudents = await prisma.student.findMany({
        where: {
          allocations: {
            none: {
              active: true
            }
          }
        },
        orderBy: [
          { createdAt: 'asc' }
        ]
      });

      if (unallocatedStudents.length === 0) {
        return {
          success: true,
          message: 'No students to allocate',
          allocations: []
        };
      }

      const allocations = [];
      const errors = [];

      for (const student of unallocatedStudents) {
        try {
          const allocation = await this.allocateStudent(student);
          if (allocation) {
            allocations.push(allocation);
          }
        } catch (error) {
          console.error(`Error allocating student ${student.name}:`, error);
          errors.push({
            studentId: student.id,
            studentName: student.name,
            error: error.message
          });
        }
      }

      return {
        success: true,
        message: `Allocated ${allocations.length} students`,
        allocations,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Allocation service error:', error);
      throw new Error(`Allocation failed: ${error.message}`);
    }
  }

  async allocateStudent(student) {
    // Determine preferred and fallback hostels
    let preferredHostel = null;
    let fallbackHostel = null;

    if (student.preferredHostel) {
      preferredHostel = await prisma.hostel.findFirst({
        where: { name: student.preferredHostel }
      });
    }

    // Set fallback to Gamma for both genders
    fallbackHostel = await prisma.hostel.findFirst({
      where: { name: 'Gamma' }
    });

    // Try preferred hostel first
    if (preferredHostel && this.canAllocateToHostel(student, preferredHostel)) {
      const room = await this.findAvailableRoom(preferredHostel.id);
      if (room) {
        return await this.createAllocation(student, room);
      }
    }

    // Try fallback hostel
    if (fallbackHostel && this.canAllocateToHostel(student, fallbackHostel)) {
      const room = await this.findAvailableRoom(fallbackHostel.id);
      if (room) {
        return await this.createAllocation(student, room);
      }
    }

    throw new Error(`No available rooms for student ${student.name}`);
  }

  canAllocateToHostel(student, hostel) {
    if (hostel.genderAllowed === 'BOTH') return true;
    if (hostel.genderAllowed === 'MALE' && student.gender === 'MALE') return true;
    if (hostel.genderAllowed === 'FEMALE' && student.gender === 'FEMALE') return true;
    return false;
  }

  async findAvailableRoom(hostelId) {
    const rooms = await prisma.room.findMany({
      where: {
        hostelId
      },
      orderBy: {
        roomNumber: 'asc'
      }
    });
    
    return rooms.find(room => room.occupiedCount < room.capacity) || null;
  }

  async createAllocation(student, room) {
    return await prisma.$transaction(async (tx) => {
      // Double-check room availability
      const currentRoom = await tx.room.findUnique({
        where: { id: room.id }
      });

      if (currentRoom.occupiedCount >= currentRoom.capacity) {
        throw new Error('Room is now full');
      }

      // Create allocation
      const allocation = await tx.allocation.create({
        data: {
          studentId: student.id,
          roomId: room.id,
          active: true
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              gender: true,
              year: true,
              branch: true
            }
          },
          room: {
            include: {
              hostel: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      // Update room occupancy
      await tx.room.update({
        where: { id: room.id },
        data: {
          occupiedCount: {
            increment: 1
          }
        }
      });

      return allocation;
    });
  }

  async getAllocations() {
    return await prisma.allocation.findMany({
      where: {
        active: true
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            year: true,
            branch: true
          }
        },
        room: {
          include: {
            hostel: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { room: { hostel: { name: 'asc' } } },
        { room: { roomNumber: 'asc' } }
      ]
    });
  }

  async getStudentAllocation(studentId) {
    return await prisma.allocation.findFirst({
      where: {
        studentId: parseInt(studentId),
        active: true
      },
      include: {
        room: {
          include: {
            hostel: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  async getHostelOccupancy() {
    const hostels = await prisma.hostel.findMany({
      include: {
        rooms: {
          select: {
            capacity: true,
            occupiedCount: true
          }
        }
      }
    });

    return hostels.map(hostel => {
      const totalCapacity = hostel.rooms.reduce((sum, room) => sum + room.capacity, 0);
      const totalOccupied = hostel.rooms.reduce((sum, room) => sum + room.occupiedCount, 0);
      
      return {
        id: hostel.id,
        name: hostel.name,
        genderAllowed: hostel.genderAllowed,
        totalCapacity,
        totalOccupied,
        availableSpots: totalCapacity - totalOccupied,
        occupancyRate: totalCapacity > 0 ? (totalOccupied / totalCapacity * 100).toFixed(1) : 0
      };
    });
  }
}

module.exports = new AllocationService();
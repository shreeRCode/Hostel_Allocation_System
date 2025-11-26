const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Admin
  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'SUPERADMIN'
    }
  });

  console.log('✅ Admin created:', admin.email);

  // Create Hostels
  const maleHostel = await prisma.hostel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Alpha Block (Male)',
      genderAllowed: 'MALE',
      capacity: 200,
      distance: 500
    }
  });

  const femaleHostel = await prisma.hostel.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Beta Block (Female)',
      genderAllowed: 'FEMALE',
      capacity: 150,
      distance: 300
    }
  });

  const mixedHostel = await prisma.hostel.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Gamma Block (Co-ed)',
      genderAllowed: 'BOTH',
      capacity: 180,
      distance: 400
    }
  });

  console.log('✅ Hostels created');

  // Create Rooms for Male Hostel
  for (let floor = 1; floor <= 5; floor++) {
    for (let room = 1; room <= 10; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      await prisma.room.upsert({
        where: { 
          hostelId_roomNumber: {
            hostelId: maleHostel.id,
            roomNumber: roomNumber
          }
        },
        update: {},
        create: {
          hostelId: maleHostel.id,
          roomNumber: roomNumber,
          capacity: 4,
          currentOccupancy: 0
        }
      });
    }
  }

  // Create Rooms for Female Hostel
  for (let floor = 1; floor <= 4; floor++) {
    for (let room = 1; room <= 8; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      await prisma.room.upsert({
        where: { 
          hostelId_roomNumber: {
            hostelId: femaleHostel.id,
            roomNumber: roomNumber
          }
        },
        update: {},
        create: {
          hostelId: femaleHostel.id,
          roomNumber: roomNumber,
          capacity: 3,
          currentOccupancy: 0
        }
      });
    }
  }

  // Create Rooms for Mixed Hostel
  for (let floor = 1; floor <= 4; floor++) {
    for (let room = 1; room <= 12; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      await prisma.room.upsert({
        where: { 
          hostelId_roomNumber: {
            hostelId: mixedHostel.id,
            roomNumber: roomNumber
          }
        },
        update: {},
        create: {
          hostelId: mixedHostel.id,
          roomNumber: roomNumber,
          capacity: 2,
          currentOccupancy: 0
        }
      });
    }
  }

  console.log('✅ Rooms created');

  // Create Sample Students
  const hashedStudentPassword = await bcrypt.hash('Student@123', 10);
  
  const students = [
    {
      name: 'John Doe',
      email: 'john@student.com',
      password: hashedStudentPassword,
      branch: 'Computer Science',
      year: 2,
      gender: 'MALE',
      disciplineScore: 85
    },
    {
      name: 'Jane Smith',
      email: 'jane@student.com',
      password: hashedStudentPassword,
      branch: 'Electronics',
      year: 1,
      gender: 'FEMALE',
      disciplineScore: 92
    },
    {
      name: 'Mike Johnson',
      email: 'mike@student.com',
      password: hashedStudentPassword,
      branch: 'Mechanical',
      year: 3,
      gender: 'MALE',
      disciplineScore: 78
    }
  ];

  for (const studentData of students) {
    await prisma.student.upsert({
      where: { email: studentData.email },
      update: {},
      create: studentData
    });
  }

  console.log('✅ Sample students created');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
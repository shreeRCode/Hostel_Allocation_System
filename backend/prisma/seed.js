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
      branch: 'Computer Science & Engineering',
      year: 2,
      gender: 'MALE',
      disciplineScore: 85
    },
    {
      name: 'Jane Smith',
      email: 'jane@student.com',
      password: hashedStudentPassword,
      branch: 'Electronics & Communication Engineering',
      year: 1,
      gender: 'FEMALE',
      disciplineScore: 92
    },
    {
      name: 'Mike Johnson',
      email: 'mike@student.com',
      password: hashedStudentPassword,
      branch: 'Mechanical Engineering',
      year: 3,
      gender: 'MALE',
      disciplineScore: 78
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@student.com',
      password: hashedStudentPassword,
      branch: 'Information Science & Engineering',
      year: 2,
      gender: 'FEMALE',
      disciplineScore: 88
    },
    {
      name: 'Alex Chen',
      email: 'alex@student.com',
      password: hashedStudentPassword,
      branch: 'Artificial Intelligence & Data Science',
      year: 1,
      gender: 'MALE',
      disciplineScore: 95
    },
    {
      name: 'Emily Davis',
      email: 'emily@student.com',
      password: hashedStudentPassword,
      branch: 'Biotechnology',
      year: 4,
      gender: 'FEMALE',
      disciplineScore: 82
    },
    {
      name: 'David Brown',
      email: 'david@student.com',
      password: hashedStudentPassword,
      branch: 'Civil Engineering',
      year: 3,
      gender: 'MALE',
      disciplineScore: 76
    },
    {
      name: 'Lisa Garcia',
      email: 'lisa@student.com',
      password: hashedStudentPassword,
      branch: 'Electrical & Electronics Engineering',
      year: 2,
      gender: 'FEMALE',
      disciplineScore: 90
    },
    {
      name: 'Ryan Miller',
      email: 'ryan@student.com',
      password: hashedStudentPassword,
      branch: 'Computer Science & Engineering(Cyber Security)',
      year: 1,
      gender: 'MALE',
      disciplineScore: 87
    },
    {
      name: 'Priya Patel',
      email: 'priya@student.com',
      password: hashedStudentPassword,
      branch: 'Robotics & Artificial Intelligence',
      year: 3,
      gender: 'FEMALE',
      disciplineScore: 93
    },
    {
      name: 'Kevin Lee',
      email: 'kevin@student.com',
      password: hashedStudentPassword,
      branch: 'Electronics Engineering (VLSI Design & Technology)',
      year: 4,
      gender: 'MALE',
      disciplineScore: 81
    },
    {
      name: 'Maria Rodriguez',
      email: 'maria@student.com',
      password: hashedStudentPassword,
      branch: 'Computer & Communication Engineering',
      year: 2,
      gender: 'FEMALE',
      disciplineScore: 89
    },
    {
      name: 'James Taylor',
      email: 'james@student.com',
      password: hashedStudentPassword,
      branch: 'Artificial Intelligence & Machine Learning',
      year: 1,
      gender: 'MALE',
      disciplineScore: 84
    },
    {
      name: 'Anna Thompson',
      email: 'anna@student.com',
      password: hashedStudentPassword,
      branch: 'Electronics & Communication (Advanced Communication Technology)',
      year: 3,
      gender: 'FEMALE',
      disciplineScore: 91
    },
    {
      name: 'Chris Anderson',
      email: 'chris@student.com',
      password: hashedStudentPassword,
      branch: 'Computer Science & Engineering',
      year: 4,
      gender: 'MALE',
      disciplineScore: 79
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
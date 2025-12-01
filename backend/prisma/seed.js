const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  // -----------------------------------------------------
  // 1. HOSTELS
  // -----------------------------------------------------
  const alpha = await prisma.hostel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Alpha Block (Male)",
      genderAllowed: "MALE",
      capacity: 200,
    },
  });

  const beta = await prisma.hostel.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Beta Block (Female)",
      genderAllowed: "FEMALE",
      capacity: 150,
    },
  });

  const gamma = await prisma.hostel.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Gamma Block (Co-ed)",
      genderAllowed: "BOTH",
      capacity: 180,
    },
  });

  console.log("✅ Hostels created");

  // -----------------------------------------------------
  // 2. ADMINS (ONE PER HOSTEL)
  // -----------------------------------------------------
  await prisma.admin.upsert({
    where: { email: "alpha@hostel.com" },
    update: {},
    create: {
      name: "Alpha Hostel Admin",
      email: "alpha@hostel.com",
      password: hashedPassword,
      role: "HOSTEL_ADMIN",
      hostelId: alpha.id,
    },
  });

  await prisma.admin.upsert({
    where: { email: "beta@hostel.com" },
    update: {},
    create: {
      name: "Beta Hostel Admin",
      email: "beta@hostel.com",
      password: hashedPassword,
      role: "HOSTEL_ADMIN",
      hostelId: beta.id,
    },
  });

  await prisma.admin.upsert({
    where: { email: "gamma@hostel.com" },
    update: {},
    create: {
      name: "Gamma Hostel Admin",
      email: "gamma@hostel.com",
      password: hashedPassword,
      role: "HOSTEL_ADMIN",
      hostelId: gamma.id,
    },
  });

  console.log("✅ Hostel admins created");

  // -----------------------------------------------------
  // 3. ROOMS
  // -----------------------------------------------------

  // Alpha (Male) → 40 rooms, 3 beds
  for (let i = 1; i <= 40; i++) {
    await prisma.room.create({
      data: {
        hostelId: alpha.id,
        roomNumber: i.toString().padStart(3, "0"),
        capacity: 3,
        currentOccupancy: 0,
      },
    });
  }

  // Beta (Female) → 30 rooms, 3 beds
  for (let i = 1; i <= 30; i++) {
    await prisma.room.create({
      data: {
        hostelId: beta.id,
        roomNumber: i.toString().padStart(3, "0"),
        capacity: 3,
        currentOccupancy: 0,
      },
    });
  }

  // Gamma (Co-ed) → 50 rooms, 2 beds
  for (let i = 1; i <= 50; i++) {
    await prisma.room.create({
      data: {
        hostelId: gamma.id,
        roomNumber: i.toString().padStart(3, "0"),
        capacity: 2,
        currentOccupancy: 0,
      },
    });
  }

  console.log("✅ Rooms created");

  // -----------------------------------------------------
  // 4. SAMPLE STUDENTS (keep yours)
  // -----------------------------------------------------

  const hashedStudentPassword = await bcrypt.hash("Student@123", 10);

  const students = [
    {
      name: "John Doe",
      email: "john@student.com",
      password: hashedStudentPassword,
      branch: "Computer Science & Engineering",
      year: 2,
      gender: "MALE",
      disciplineScore: 85,
    },
    {
      name: "Jane Smith",
      email: "jane@student.com",
      password: hashedStudentPassword,
      branch: "Electronics & Communication Engineering",
      year: 1,
      gender: "FEMALE",
      disciplineScore: 92,
    },
    // ... your other students here
  ];

  for (const s of students) {
    await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    });
  }

  console.log("✅ Sample students added");
  console.log("🎉 Seed completed!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

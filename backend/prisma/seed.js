const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SEED...");

  // -----------------------------------------------------
  // 0. WIPE DATABASE (Reset)
  // -----------------------------------------------------
  console.log("🗑️ Clearing existing data...");

  await prisma.allocation.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.room.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.student.deleteMany();

  console.log("✅ Database cleared");

  // -----------------------------------------------------
  // 1. CREATE HOSTELS
  // -----------------------------------------------------
  console.log("🏨 Creating Hostels...");

  const alpha = await prisma.hostel.create({
    data: {
      name: "Alpha",
      genderAllowed: "FEMALE",
      capacity: 90,
    },
  });

  const beta = await prisma.hostel.create({
    data: {
      name: "Beta",
      genderAllowed: "MALE",
      capacity: 120,
    },
  });

  const gamma = await prisma.hostel.create({
    data: {
      name: "Gamma",
      genderAllowed: "BOTH",
      capacity: 100,
    },
  });

  console.log("✅ Hostels created");

  // -----------------------------------------------------
  // 2. CREATE ADMINS
  // -----------------------------------------------------
  console.log("👩‍💼 Creating Admins...");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.admin.createMany({
    data: [
      {
        name: "Alpha Admin",
        email: "alpha@hostel.com",
        password: hashedPassword,
        role: "HOSTEL_ADMIN",
        hostelId: alpha.id,
      },
      {
        name: "Beta Admin",
        email: "beta@hostel.com",
        password: hashedPassword,
        role: "HOSTEL_ADMIN",
        hostelId: beta.id,
      },
      {
        name: "Gamma Admin",
        email: "gamma@hostel.com",
        password: hashedPassword,
        role: "HOSTEL_ADMIN",
        hostelId: gamma.id,
      },
    ],
  });

  console.log("✅ Admins created");

  // -----------------------------------------------------
  // 3. CREATE ROOMS
  // -----------------------------------------------------
  console.log("🚪 Creating Rooms...");

  // Alpha → 30 rooms × 3 beds
  for (let i = 1; i <= 30; i++) {
    await prisma.room.create({
      data: {
        hostelId: alpha.id,
        roomNumber: i.toString().padStart(3, "0"),
        capacity: 3,
      },
    });
  }

  // Beta → 40 rooms × 3 beds
  for (let i = 1; i <= 40; i++) {
    await prisma.room.create({
      data: {
        hostelId: beta.id,
        roomNumber: i.toString().padStart(3, "0"),
        capacity: 3,
      },
    });
  }

  // Gamma → 50 rooms × 2 beds
  for (let i = 1; i <= 50; i++) {
    await prisma.room.create({
      data: {
        hostelId: gamma.id,
        roomNumber: i.toString().padStart(3, "0"),
        capacity: 2,
      },
    });
  }

  console.log("✅ Rooms created");

  // -----------------------------------------------------
  // 4. SAMPLE STUDENTS
  // -----------------------------------------------------
  console.log("🎓 Creating sample students...");

  const hashedStudentPassword = await bcrypt.hash("Student@123", 10);

  await prisma.student.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@student.com",
        password: hashedStudentPassword,
        branch: "CSE",
        year: 2,
        gender: "MALE",
        preferredHostel: "Beta",
      },
      {
        name: "Jane Smith",
        email: "jane@student.com",
        password: hashedStudentPassword,
        branch: "ECE",
        year: 1,
        gender: "FEMALE",
        preferredHostel: "Alpha",
      },
      {
        name: "Asha Rao",
        email: "asha@student.com",
        password: hashedStudentPassword,
        branch: "CSE",
        year: 3,
        gender: "FEMALE",
        preferredHostel: "Gamma",
      },
    ],
  });

  console.log("✅ Sample students added");

  console.log("🎉 SEED COMPLETED!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const prisma = require("../config/prisma");

// SLA times in HOURS
const SLA_HOURS = {
  ELECTRICITY: 6,
  WATER: 12,
  INTERNET: 24,
  WIFI: 24,
  PLUMBING: 12,
  CLEANING: 48,
  FURNITURE: 48,
  OTHER: 24,
};

// fallback SLA
const DEFAULT_SLA = 24;

async function checkSLAViolations() {
  try {
    const complaints = await prisma.complaint.findMany({
      where: {
        status: {
          not: "RESOLVED",
        },
        slaViolated: false,
      },
    });

    const now = new Date();

    for (const complaint of complaints) {
      const category = complaint.category?.toUpperCase();

      const slaHours = SLA_HOURS[category] || DEFAULT_SLA;

      const deadline = new Date(complaint.createdAt);
      deadline.setHours(deadline.getHours() + slaHours);

      if (now > deadline) {
        await prisma.complaint.update({
          where: { id: complaint.id },
          data: {
            slaViolated: true,
            status: "ESCALATED",
            escalatedAt: new Date(),
          },
        });
      }
    }

    console.log("SLA check completed");
  } catch (error) {
    console.error("SLA check error:", error);
  }
}

module.exports = { checkSLAViolations };

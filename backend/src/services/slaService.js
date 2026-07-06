const prisma = require("../config/prisma");

// SLA times in HOURS.
// Keys are the UPPERCASED versions of the categories the complaint form
// actually submits (see COMPLAINT_CATEGORIES on the frontend). Keep these in
// sync so escalation doesn't silently fall back to the default for every issue.
const SLA_HOURS = {
  ELECTRICAL: 6,
  PLUMBING: 12,
  HVAC: 24,
  NETWORK: 24,
  CLEANLINESS: 48,
  SECURITY: 6,
  FURNITURE: 48,
  MAINTENANCE: 24,
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

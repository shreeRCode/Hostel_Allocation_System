require("dotenv").config();
const app = require("./app");
const { checkSLAViolations } = require("./services/slaService");

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at /api`);

  // Run SLA check every 5 minutes
  setInterval(
    async () => {
      try {
        await checkSLAViolations();
        console.log("🕒 SLA violation check executed");
      } catch (err) {
        console.error("❌ SLA check error:", err.message);
      }
    },
    5 * 60 * 1000,
  );
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠ Port ${PORT} is busy`);
  } else {
    console.error("❌ Server error:", err);
  }
});

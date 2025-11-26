require('dotenv').config();
const app = require('./app');

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
    app.listen(PORT + 1, () => {
      console.log(`🚀 Server running on port ${PORT + 1}`);
      console.log(`📡 API available at http://localhost:${PORT + 1}/api`);
    });
  }
});
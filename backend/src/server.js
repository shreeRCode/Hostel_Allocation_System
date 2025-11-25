const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hostel Allocation System API' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock API routes for testing
app.get('/api/students', (req, res) => {
  res.json({ students: [] });
});

app.get('/api/hostels', (req, res) => {
  res.json({ hostels: [] });
});

app.get('/api/rooms', (req, res) => {
  res.json({ rooms: [] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
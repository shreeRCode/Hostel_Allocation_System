

```md
# Smart Hostel Allocation & SLA-Based Complaint Management System

A full-stack web application for automated hostel allocation and SLA-based complaint management using React, Node.js, Express, Prisma, and MySQL.

## Features

### Student
- Login and dashboard
- View room allocation
- Submit complaints
- Track complaint status

### Admin
- View hostel occupancy and allocation statistics
- Manage hostels, rooms, and allocations
- View and update complaints
- SLA-based escalation tracking

### System
- Rule-based hostel allocation
- Relational schema using Prisma ORM
- REST API structure
- TailwindCSS-based responsive UI

## Tech Stack

Frontend: React, Vite, TailwindCSS, React Router  
Backend: Node.js, Express, Prisma ORM, MySQL

## Project Structure

```

frontend/
src/
components/
pages/
context/
services/
utils/

backend/
prisma/
schema.prisma
migrations/
src/
controllers/
routes/
middleware/
prismaClient.js

```

## Setup Instructions

### Frontend
```

cd frontend
npm install
npm run dev

```

### Backend
```

cd backend
npm install

```

Create `.env`:
```

DATABASE_URL="mysql://root:PASSWORD@localhost:3306/hostel_management"
JWT_SECRET="your_jwt_secret"
PORT=4000

```

Run Prisma migrations:
```

npx prisma migrate dev

```

Start backend:
```

npm run dev

```

## Status
Frontend completed. Backend setup and API integration in progress.
```

---

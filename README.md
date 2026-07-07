# Smart Hostel Management System

A full-stack web application that automates hostel room allocation and
SLA-tracked complaint management for college hostels — built with React,
Express, and Prisma/PostgreSQL.

**Live:** [hostel-allocation-system.vercel.app](https://hostel-allocation-system.vercel.app)
**Docs:** [Problem Statement](docs/PROBLEM_STATEMENT.md) · [ER Diagram](docs/ERD/ERD.md)

## What it does

Students register with their gender, branch, and preferred hostel and are
**automatically assigned a room** the moment one is available — no manual
allocation. If they raise a maintenance complaint (electrical, plumbing,
network, etc.), it's tracked against a per-category SLA deadline; anything
left unresolved past that deadline is **automatically escalated**. Once an
admin marks an issue resolved, the student confirms the fix actually worked
before it's considered closed — so a complaint can't be marked "done" without
the person who reported it agreeing.

### Student
- Register and get automatically allocated a room (gender + preference + fallback hostel + capacity aware)
- View current room allocation
- Raise, view, and search complaints with category/priority
- Get notified (in-app) when a complaint is marked resolved, and confirm the fix

### Admin
- Dashboard scoped to their own hostel: students, rooms, allocations, complaints
- Run the allocation algorithm on demand
- Move complaints through Pending → In Progress → Resolved / Escalated
- SLA violations are auto-escalated and highlighted

### System
- Rule-based allocation with primary-preference + gender-compatible fallback hostel
- Background job checks every 5 minutes for SLA-breached complaints and auto-escalates them
- JWT auth, bcrypt-hashed passwords, hostel-scoped role-based access control

## Tech Stack

| | |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT + bcrypt |
| **Deployment** | Vercel (frontend) · Render (backend) · Neon (database) |

## Project Structure

```
frontend/
  src/
    components/   # common (Card, Table, Modal, StatusBadge, Icons) + layout (Sidebar, Topbar, AppLayout)
    pages/         # HomePage, auth/, student/, admin/
    context/       # AuthContext
    services/      # apiClient, authService
    utils/         # constants, session

backend/
  prisma/
    schema.prisma  # single source of truth for the data model
    migrations/
    seed.js        # seeds 3 hostels, their rooms, and one admin per hostel
  src/
    routes/        # auth, admin, student, complaints, hostels, rooms, allocation
    services/      # allocationService, slaService
    middleware/     # authMiddleware, errorHandler
    utils/          # auth (hash/verify/JWT), sanitize (safe field selection)

docs/
  PROBLEM_STATEMENT.md
  ERD/ERD.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database ([Neon](https://neon.tech) free tier works well)

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in real values:

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="<generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">"
PORT=8080
FRONTEND_URL=http://localhost:5173
```

Apply the schema and seed sample data (3 hostels, their rooms, one admin each):

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed
```

Start the API:

```bash
npm run dev   # http://localhost:8080/api
```

### Frontend

```bash
cd frontend
npm install
```

Set `VITE_API_URL` in `frontend/.env`:

```
VITE_API_URL=http://localhost:8080/api
```

```bash
npm run dev   # http://localhost:5173
```

### Try it out

After seeding, these admin accounts exist (password for all: `Admin@123`):

| Hostel | Email |
|---|---|
| Alpha (Girls) | `alpha@hostel.com` |
| Beta (Boys) | `beta@hostel.com` |
| Gamma (Co-ed) | `gamma@hostel.com` |

Register a student account from the UI, then log in as the matching hostel
admin and click **Run Allocation** to assign them a room.

## Security notes

- Passwords are bcrypt-hashed; never returned in any API response.
- All protected routes require a valid JWT; the server refuses to start without a real `JWT_SECRET`.
- Admins only ever see data for their own hostel — enforced server-side, not just hidden in the UI.
- CORS is restricted to the deployed frontend origin (plus any `localhost` port in development).

## Status

Core flows (registration, automated allocation, complaints, SLA escalation,
student confirmation) are implemented and tested end-to-end. Not yet built:
admin room/hostel CRUD, room de-allocation/transfer, and email/SMS
notifications — see [docs/PROBLEM_STATEMENT.md](docs/PROBLEM_STATEMENT.md#5-out-of-scope-current-version)
for the full list of what's intentionally out of scope for this version.

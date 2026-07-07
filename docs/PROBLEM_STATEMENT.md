# Smart Hostel Management System — Problem Statement

## 1. Background

College hostels house hundreds of students, and two everyday activities are still
handled manually in most institutions:

1. **Room allocation** — deciding which student gets which room, respecting
   gender rules, hostel preferences, and available capacity. Done by hand this is
   slow, error-prone, and often unfair.
2. **Maintenance complaints** — day-to-day issues such as no water, power/electrical
   faults, internet outages, plumbing leaks, or cleanliness. Students report these
   informally (in person, on paper, or over chat), so complaints get lost, nobody
   tracks how long they have been pending, and serious issues are not escalated to
   the right authority in time.

The result is wasted time, frustrated students, and no visibility for wardens or
administrators into what is actually happening in their hostel.

## 2. Problem Statement

> Students in college hostels regularly face unresolved maintenance problems (water,
> electricity, internet, plumbing, cleanliness, etc.) and a slow, manual room‑allocation
> process. There is no single system that (a) automatically allocates rooms based on
> student gender, hostel preference, and room availability, and (b) lets students raise
> complaints and track them to resolution — **and automatically escalates a complaint to
> higher officials when it is not resolved within an acceptable time.**

The **Smart Hostel Management System** is a web application that automates both of
these workflows and gives administrators a clear dashboard of their hostel.

## 3. Objectives

- Provide a single website where students register and are **automatically allocated**
  a hostel room based on gender, preferred hostel, and availability.
- Let students **raise and track maintenance complaints** with a category and severity.
- Ensure accountability through a **Service Level Agreement (SLA)**: every complaint has
  a resolution deadline based on its category, and any complaint that misses its deadline
  is **automatically escalated**.
- Give each hostel administrator a dashboard to view students, rooms, allocations, and
  complaints **scoped to their own hostel**, and to resolve or escalate complaints.

## 4. Scope (In Scope)

- Student self‑registration and secure login.
- Hostel administrator login (one admin per hostel).
- Three hostels with gender rules: **Alpha (Girls)**, **Beta (Boys)**, **Gamma (Co‑ed)**,
  each containing a fixed set of fixed‑capacity rooms.
- **Automated allocation** with a primary‑preference + fallback strategy and capacity
  checks (a student is never placed in a full room or a gender‑incompatible hostel).
- **Complaint management**: create, list, and view complaints. Admins move a
  complaint through Pending → In Progress → Resolved, or Escalated; once an
  admin marks a complaint Resolved, the student who raised it confirms the fix
  before it's considered Closed.
- **SLA monitoring**: a background job periodically checks unresolved complaints and
  escalates any that have breached their category deadline.

## 5. Out of Scope (current version)

- Online fee/rent payment and billing.
- Room-change / swap requests and de‑allocation workflow.
- Notifications by email/SMS/push (escalation is reflected in status only).
- Mess / attendance / visitor management.

## 6. Actors

| Actor | Description |
|-------|-------------|
| **Student** | Registers, is allocated a room, raises and tracks complaints. |
| **Hostel Administrator** | Manages one hostel: views rooms/allocations/students, runs allocation, resolves or escalates complaints. |
| **System (automated)** | Runs the allocation algorithm and the periodic SLA/escalation check. |
| **Higher Officials** *(conceptual)* | Recipients of escalated complaints (represented today by the `ESCALATED` status / `slaViolated` flag). |

## 7. Functional Requirements

**Authentication & Roles**
- FR1: A student can register with name, email, password, branch, year, gender, and preferred hostel.
- FR2: Students and admins can log in; access to pages/data is restricted by role.

**Room Allocation**
- FR3: The system allocates unallocated students to a room in their **preferred** hostel if space is available.
- FR4: If the preferred hostel is full, the system falls back to a **gender‑compatible** alternative (e.g., a co‑ed hostel).
- FR5: A student is never allocated to a full room; room occupancy is updated atomically on each allocation.
- FR6: Each student holds at most **one active allocation** at a time.

**Complaint Management**
- FR7: An allocated student can raise a complaint with a title, category, severity, and description.
- FR8: A student can view the status and history of their own complaints.
- FR9: An admin can view all complaints **for their own hostel** and move them through Pending → In Progress → Resolved, or Escalated.
- FR9a: Once an admin marks a complaint **Resolved**, it is not yet Closed — the reporting student sees it flagged as "awaiting your confirmation" (sidebar badge + dashboard stat) and must confirm the fix before it moves to **Closed**. This keeps admins accountable for follow-through rather than just paperwork.

**SLA & Escalation**
- FR10: Each complaint category has a target resolution time (SLA).
- FR11: A background process periodically checks unresolved complaints; any past its SLA deadline is flagged `slaViolated` and set to `ESCALATED`, recording the escalation time.

## 8. Non‑Functional Requirements

- **Security**: passwords stored as bcrypt hashes; protected APIs require a valid JWT; role‑based access control; a hostel admin can only see/act on their own hostel's data.
- **Reliability/Durability**: data persists in a managed PostgreSQL database (survives server restarts and redeploys).
- **Usability**: responsive UI usable on both desktop and mobile.
- **Maintainability**: clear separation of frontend (React) and backend (Express + Prisma) with a single schema as the source of truth.

## 9. Assumptions & Constraints

- Hostel names are unique and gender rules are fixed at seed time.
- One administrator account exists per hostel.
- "Higher officials" is modelled by the escalation state rather than a separate login (a future enhancement).

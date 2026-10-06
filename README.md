# Zen Freelancer Team Management Platform

A complete, production-quality, frontend-only web app for managing the end-to-end client lifecycle across Team A (Lead Generation), Team B (Calling & Follow-up), Team C (Project Execution), and Admin oversight.

---

## 🚀 Features & Workflow Highlights

### End-to-End Integrated Lifecycle
`LEAD GENERATION (Team A) → CALL & FOLLOW-UP (Team B) → CLIENT SELECTION & REQUIREMENTS (Team B) → PAYMENT CONFIRMATION (Team B) → PROJECT EXECUTION & COMPLETION (Team C)`

- **Unified In-Memory State Store (Zustand + `localStorage`)**: Actions performed in one team's UI immediately update next-stage team views and real-time activity history logs.
- **Service Abstraction Layer (`src/services/`)**: Clean Promise-returning API wrappers allowing a real backend (Node.js/Express, Python, Java, Firebase) to replace mock data without touching components.
- **Live Timer Calling Interface**: Features interactive call start/end timer, outcome recorder, and call notes logging.
- **9-Step Visual Journey Stepper**: Color-coded timeline stepper showing completed, active, and upcoming stages on project detail views.
- **Role-Based Access Control (RBAC)**: Route guards protecting `/admin/*`, `/team-a/*`, `/team-b/*`, `/team-c/*`, with quick demo role switcher in top navbar.
- **Member Management (Admin Only)**: Aadhaar 12-digit numeric validation, photo preview, and masked Aadhaar display (`XXXX-XXXX-1234`).
- **Rich Data Visualizations**: Interactive Recharts bar, donut, and pie charts on Admin Dashboard and Reports pages.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling & UI**: Tailwind CSS v3, Lucide React icons, Shadcn-inspired reusable primitives
- **State Management**: Zustand (persisted to `localStorage`)
- **Routing**: React Router v6 with `ProtectedRoute` RBAC guards
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts
- **Toast Notifications**: Sonner

---

## 📦 Setup & Running Locally

1. **Clone or Navigate to Project Directory**:
   ```bash
   cd "zen frontend"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build & Type Check**:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Access Roles & Accounts

You can switch roles anytime using the **"Active Scope"** selector in the sidebar or top navbar:

| Role | Accessible Routes | Description |
| :--- | :--- | :--- |
| **Admin** | `/admin/*`, `/team-a/*`, `/team-b/*`, `/team-c/*` | Full system access, member management, all leads/clients/projects, reports & settings |
| **Team A** | `/team-a`, `/team-a/leads`, `/team-a/add-lead` | Lead generation workstation, + Add Lead form, forward leads to Team B |
| **Team B** | `/team-b`, `/team-b/leads`, `/team-b/follow-ups`, `/team-b/calls`, `/team-b/clients` | Calling workspace with live timer, follow-up calendar, requirement scope collector, payment recorder |
| **Team C** | `/team-c`, `/team-c/projects`, `/team-c/clients`, `/projects/:id` | Project execution dashboard, requirement viewer, progress slider, completion sign-off |

---

## 🗺️ Route Map

- `/login` — Demo login & role picker
- `/admin` — Executive Admin Dashboard & Activity History Timeline
- `/admin/team-a` — Admin view of Team A metrics & lead generation rates
- `/admin/team-b` — Admin view of Team B calls, talk time, and payment collections
- `/admin/team-c` — Admin view of Team C engineering workload & progress
- `/admin/leads` — Master Lead Register
- `/admin/clients` — Master Client Register
- `/admin/projects` — Master Project Register
- `/admin/reports` — Cross-team Analytics & Recharts Reports
- `/admin/settings` — System state backup export (JSON) and seed data reset
- `/team-a` — Team A Dashboard
- `/team-a/leads` — Team A Lead Register with forward buttons
- `/team-a/add-lead` — Standalone Add Lead Form Page
- `/team-b` — Team B Dashboard
- `/team-b/leads` — Team B Calling Queue
- `/team-b/follow-ups` — Follow-up Calendar & Schedule
- `/team-b/calls` — Call History & Talk Time Logs
- `/team-b/clients` — Converted Clients, Scope Collector & Payment Modals
- `/team-c` — Team C Dashboard
- `/team-c/projects` — Team C Projects Register
- `/team-c/clients` — Team C Client Specs Viewer
- `/projects/:id` — Comprehensive Project Detail Page featuring 9-step Journey Stepper

---

## 🔌 How to Connect a Real Backend

All data access is encapsulated inside service modules located in `src/services/index.ts`:

- `memberService` (`getMembers`, `addMember`, `deactivateMember`)
- `leadService` (`getLeads`, `addLead`, `forwardLead`, `updateLeadStatus`)
- `callService` (`getCalls`, `recordCall`)
- `followUpService` (`getFollowUps`, `addFollowUp`, `completeFollowUp`)
- `requirementService` (`getRequirements`, `saveRequirement`)
- `paymentService` (`getPayments`, `recordPayment`)
- `projectService` (`getProjects`, `updateProjectStatus`, `updateProjectProgress`)
- `activityService` (`getActivities`)

To connect a backend, replace the Zustand store calls in `src/services/index.ts` with standard `fetch()` or `axios` API calls (e.g. `await fetch('/api/leads')`). Zero changes to UI components will be required.

# NovaFlow AI — AI Meeting to Project CRM

> From meeting notes to executable work. Built for **INFINITY HACK ’26** by team **shadow duo**.

---

## Team
- **Team Name**: shadow duo
- **Four Members & Responsibilities**:
  1. **Member 1 (Frontend / UI Developer)**: Application interface, Linear/Vercel design system, responsive layouts, dashboard widgets, and multi-stage AI progress indicators.
  2. **Member 2 (Backend Developer)**: Next.js server runtime, PostgreSQL database integration with Prisma, JWT cookie session authentication, and server-side role authorization guards.
  3. **Member 3 (AI / Integration Developer)**: OpenRouter API integration, deterministic meeting extraction engine, prompt engineering, Zod schema validation, and fallback handling.
  4. **Member 4 (Product & Full-Stack Developer)**: End-to-end integration, atomic database transaction handling, E2E test verification suite, and cloud database deployment.
- **Repository**: [https://github.com/riazaslam029/novaflow-ai](https://github.com/riazaslam029/novaflow-ai)

---

## What Works
NovaFlow AI is a high-precision, production-grade Project Management CRM built for NovaWorks Technologies that transforms unstructured meeting transcripts into fully validated, executable project roadmaps:

- **Seeded Authentication**: 10 pre-configured company accounts (1 Administrator, 3 Project Managers, 6 Developer Agents) with secure bcrypt password hashing and persistent JWT session cookies.
- **Hero AI Transcript Engine (`/create-from-transcript`)**: 
  - Admin-only access.
  - Multi-stage pipeline progress indicator (*Reading transcript*, *Identifying projects*, *Matching team directory*, *Extracting tasks*, *Validating dates*, *Executing transaction*).
  - 1-click presets to test both the official 60-minute condensed transcript and modified judge attack transcripts.
  - Live pre-commit plan preview with validation badges.
- **Atomic Database Transactions**: All extracted projects and tasks are persisted in a single `prisma.$transaction(...)`. If any record fails schema or business-rule validation, zero partial data is stored.
- **Strict Server-Side Authorization**:
  - **ADMIN**: Complete system overview, company-wide project/task visibility, AI transcript execution, and demo database reset.
  - **MANAGER**: Strictly restricted to projects they manage (e.g., Ayesha Khan only accesses UrbanCart; Bilal Ahmed only accesses QuickServe; Hina Malik only accesses HelpDeskPro). Direct URL manipulation (`/projects/[id]`) is actively rejected with HTTP 403 Forbidden.
  - **AGENT**: Strictly sees only tasks assigned directly to them (e.g., Ali Raza sees his 3 UrbanCart tasks; Hamza Shah sees his 2 API tasks across UrbanCart and QuickServe). Never leaks other agents' tasks.
- **Cloud Database Persistence**: Connected to hosted **Aiven for PostgreSQL** with ACID relational integrity and cascading task foreign keys.
- **Clean Reset Utility**: Admin can reset generated demo projects and tasks in one click between judging rounds while keeping all 10 seeded accounts intact.

---

## Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, clsx / tailwind-merge
- **Backend**: Next.js Server Handlers, Node.js 24 runtime, Edge-compatible HTTP cookies
- **Database**: **Aiven for PostgreSQL** (Cloud Managed), Prisma ORM 6.19
- **Authentication**: Stateless, tamper-proof `jose` HS256 JWT tokens in secure `httpOnly` cookies with bcrypt password hashing
- **AI Pipeline**: OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`, `google/gemini-2.0-flash-exp:free`, or configurable model) + High-Precision Deterministic Fallback Engine
- **Validation**: Zod schema validation + Business rule verification (role matching, task deadlines $\le$ project deadlines, positive hours)

---

## Links
- **Live Repository**: [https://github.com/riazaslam029/novaflow-ai](https://github.com/riazaslam029/novaflow-ai)
- **Hosted Database**: Aiven for PostgreSQL (High-availability cloud cluster in Europe/Frankfurt)
- **Demo Video**: [Accessible walkthrough video showing Login, Transcript Conversion, Role Dashboards, and Modified Input Test]

---

## Requirements
- **Node.js**: v20.x or higher (tested on Node v24.21.0)
- **Package Manager**: npm v10+ or v11+
- **Database**: PostgreSQL (Aiven cloud URI provided in `.env`) or local SQLite / PostgreSQL
- **Internet Access**: Required for connecting to Aiven PostgreSQL and OpenRouter API

---

## Run Locally

### 1. Clone the repository and enter the directory:
```bash
git clone https://github.com/riazaslam029/novaflow-ai.git
cd novaflow-ai
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Configure environment variables:
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
*(The `.env` file is pre-configured to connect to our hosted Aiven PostgreSQL cluster).*

### 4. Apply database schema:
```bash
npm run db:push
```

### 5. Seed the 10 demo accounts:
```bash
npm run db:seed
```
> **Note**: The seed script is completely idempotent. Re-running it will never create duplicate accounts.

### 6. Run automated verification suite (Optional but recommended):
```bash
npx tsx scripts/verify-all.mjs
```
*This executes a full end-to-end check across database seeding, AI extraction (3 projects, 12 tasks, 124 hours), atomic transactions, server-side role isolation (Admin, Manager, Agent), and modified transcript dynamic handling.*

### 7. Start the development server:
```bash
npm run dev
```
Open your browser at: **`http://localhost:3000`**

---

## Environment Variables

| Variable | Purpose | Where Configured |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (Aiven Cloud URI with SSL) | Server-side only (`.env`) |
| `SESSION_SECRET` | Cryptographic secret key for signing JWT session cookies | Server-side only (`.env`) |
| `OPENROUTER_API_KEY` | OpenRouter credential for LLM transcript extraction | Server-side only (`.env`) |
| `AI_MODEL` | Target LLM model identifier | Server-side only (`.env`) |

> **Security Note**: No API keys or database credentials are exposed to the client bundle (`NEXT_PUBLIC_*`). All AI calls and database transactions execute strictly on the server.

---

## Demo Login Accounts

All accounts share the default demo password: **`Demo123!`**  
The login screen also provides a **1-Click Quick Judge Selector** to switch personas instantly!

| Role | Name | Demo Email | Specialization | Skills | Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Admin | `admin@novaworks.example` | Administrator | Company overview, transcript creation | `Demo123!` |
| **Manager** | Ayesha Khan | `ayesha@novaworks.example` | Web PM | Web projects, client coordination | `Demo123!` |
| **Manager** | Bilal Ahmed | `bilal@novaworks.example` | Mobile PM | Mobile projects, delivery planning | `Demo123!` |
| **Manager** | Hina Malik | `hina@novaworks.example` | AI PM | AI projects, requirement review | `Demo123!` |
| **Agent** | Ali Raza | `ali@novaworks.example` | Full-Stack | React, frontend integration | `Demo123!` |
| **Agent** | Hamza Shah | `hamza@novaworks.example` | Full-Stack | Node.js, databases, APIs | `Demo123!` |
| **Agent** | Sara Noor | `sara@novaworks.example` | App Developer | Flutter, mobile UI | `Demo123!` |
| **Agent** | Usman Tariq | `usman@novaworks.example` | App Developer | Flutter, integration, testing | `Demo123!` |
| **Agent** | Zain Abbas | `zain@novaworks.example` | AI Developer | LLMs, extraction, prompts | `Demo123!` |
| **Agent** | Maryam Asif | `maryam@novaworks.example` | AI Developer | Retrieval, document processing | `Demo123!` |

---

## How Judges Can Test (Step-by-Step)

### Step 1: Admin Login & Transcript Conversion
1. Open `http://localhost:3000` (redirects to `/login`).
2. Click **Admin** on the 1-click demo switcher (or enter `admin@novaworks.example` / `Demo123!`).
3. Click **Sign In**.
4. Navigate to **Create from Transcript** via the sidebar or the dashboard hero card.
5. Click **Load Official Meeting Transcript** (populates the official 60-min condensed meeting text).
6. Click **Create Projects with AI**.
7. Observe the multi-stage visual pipeline. Upon completion, verify the green success banner:
   - **3 Projects Created**
   - **12 Tasks Scheduled**
   - **124 Hours Total Developer Effort**

### Step 2: Verify Project & Task Extraction
1. Click **View Projects** or navigate to `/projects`.
2. Inspect the 3 extracted projects:
   - **UrbanCart Website**: Client *UrbanCart Clothing*, Manager *Ayesha Khan*, Deadline *2026-10-20*, 4 tasks (40 hrs).
     - *Product catalog UI* (Ali Raza, 12h, 2026-10-12)
     - *Demo cart UI* (Ali Raza, 8h, 2026-10-15)
     - *Product and cart APIs* (Hamza Shah, 14h, 2026-10-14)
     - *Website integration and testing* (Ali Raza, 6h, 2026-10-19)
   - **QuickServe Mobile App**: Client *QuickServe Services*, Manager *Bilal Ahmed*, Deadline *2026-10-24*, 4 tasks (46 hrs).
     - *Login and profile screens* (Sara Noor, 8h, 2026-10-12)
     - *Service booking screens* (Sara Noor, 12h, 2026-10-17)
     - *Booking and account APIs* (Hamza Shah, 16h, 2026-10-16)
     - *Mobile integration and testing* (Usman Tariq, 10h, 2026-10-22)
   - **HelpDeskPro AI Assistant**: Client *HelpDeskPro Solutions*, Manager *Hina Malik*, Deadline *2026-10-22*, 4 tasks (38 hrs).
     - *FAQ document processing* (Maryam Asif, 10h, 2026-10-13)
     - *Assistant answer generation* (Zain Abbas, 14h, 2026-10-17)
     - *Human escalation flow* (Zain Abbas, 6h, 2026-10-18)
     - *Assistant evaluation and testing* (Maryam Asif, 8h, 2026-10-21)
3. Notice that out-of-scope features discussed in the meeting were properly rejected (no payment gateways, no inventory tasks, no maps, no driver tracking, no real email integration, and Kamran was not added as an employee).

### Step 3: Test Manager Role Isolation
1. Sign out and log in as **Ayesha Khan** (`ayesha@novaworks.example`).
2. Verify that **only UrbanCart Website** appears on her dashboard and projects list. QuickServe and HelpDeskPro are completely hidden.
3. Attempt to bypass authorization by directly navigating to the URL of Bilal's project (`/projects/[id-of-quickserve]`).
4. Verify that the server returns a clean **403 Forbidden Access Denied** screen.

### Step 4: Test Agent Role Isolation
1. Sign out and log in as **Ali Raza** (`ali@novaworks.example`).
2. Open **My Tasks**: Ali sees strictly his 3 assigned tasks for UrbanCart Website.
3. Sign out and log in as **Hamza Shah** (`hamza@novaworks.example`).
4. Open **My Tasks**: Hamza sees his 2 API tasks across both UrbanCart and QuickServe.

### Step 5: Test Modified Transcript (Proves Dynamic AI Processing)
1. Log back in as **Admin**.
2. Click **Reset Demo Projects** on `/create-from-transcript` to clear previous projects.
3. Click **Load Modified Test Transcript** (this changes QuickServe Mobile integration to *12 hours* and *23 October*).
4. Click **Create Projects with AI**.
5. Verify the updated values:
   - Total effort is now **126 hrs** (124 + 2).
   - QuickServe Mobile integration is updated to **12 hours** with deadline **2026-10-23**, while all other tasks remain unchanged.

---

## Deployment Details
- **Deployment Status**: Configured with Hosted Cloud Database
- **Database Provider**: **Aiven for PostgreSQL** (Dedicated Managed Cluster with SSL)
  - Host: `pg-3a31d786-riazaslam029-novaflow.l.aivencloud.com:12532`
  - Database: `defaultdb`
  - SSL Mode: `require`
- **Application Engine**: Next.js App Router (Node.js 24 runtime)

---

## Known Limitations
- The seeder initializes 10 demo accounts for the 4-person hackathon scenario; user signup is intentionally omitted per the official challenge specification.
- OpenRouter API rate limits on free-tier models are handled gracefully through the built-in deterministic validation engine.

---

## Submission Summary
- **Source Repository**: [https://github.com/riazaslam029/novaflow-ai](https://github.com/riazaslam029/novaflow-ai)
- **Team**: shadow duo
- **Challenge**: AI Project Manager — Meeting to Execution (Infinity Hack ’26)
- **Database**: Aiven for PostgreSQL (Cloud Hosted & Verified)
- **Seeded Accounts**: 10 Accounts verified (Admin, 3 Managers, 6 Agents)
- **Features Completed**: 100% of non-negotiable and primary requirements implemented, tested, and passing.

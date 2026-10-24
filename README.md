# EthioEqub Digital Management System (ዕቁብ)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x_LTS-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.x-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-10%20Passed-brightgreen.svg)]()

> A professional, secure, full-stack digital management platform modernizing traditional Ethiopian **Rotating Savings and Credit Associations (ROSCA / ዕቁብ)**.

---

## 1. System Overview

Traditional Equb associations in Ethiopia pool hundreds of millions of Birr annually. However, they rely heavily on informal notebooks, physical receipts, and verbal agreements, leading to record loss, payment disputes, and unilateral control.

**EthioEqub** digitizes and governs Equb operations end-to-end:
- **Zero IEEE-754 Precision Loss:** All financial calculations strictly executed as 64-bit integer minor units (santim / cents). 1 Birr = 100 santim.
- **Ledger Immutability (Zero In-Place Deletions):** Corrections are recorded exclusively through signed differential adjustment rows (`Adjustment`) linked to the parent transaction.
- **Dual-Control Payout Governance:** Disbursing pooled funds requires independent authorization from two distinct accounts (`Approver 1 != Approver 2`), with configurable single-approval for small family circles (&lt; 5 members).
- **Duplicate Reference Prevention:** Unique composite database constraints block accidental duplicate receipt submissions on Telebirr, CBE Birr, and Bank transfers.
- **Tamper-Evident Audit Trail:** Every mutating action captures actor identity, timestamp, IP address, and JSON state diffs.
- **Exportable Ledgers:** Sanitized CSV transaction ledgers protected against formula-injection attacks.

---

## 2. Monorepo Project Architecture

```text
EthioEqub Digital Management System/
├── client/                     # Frontend Single Page Application
│   ├── src/
│   │   ├── components/common/  # Navbar, Sidebar, Layout shells
│   │   ├── context/            # AuthContext (session hydration)
│   │   ├── pages/              # Dashboard, Groups, Contributions, Payouts, Reports, Audit
│   │   ├── services/           # Typed apiRequest client with cookie credentials
│   │   └── main.tsx            # App router & entry point
│   ├── index.html
│   ├── vite.config.ts          # Vite bundler configuration & /api proxy
│   └── tailwind.config.js      # Custom theme styling
│
├── server/                     # Backend REST API Server
│   ├── prisma/
│   │   ├── schema.prisma       # 10 Relational entities matching PRTDD specification
│   │   └── seed.ts             # Realistic Ethiopian Equb seeder script
│   ├── src/
│   │   ├── config/             # Database connection singleton
│   │   ├── controllers/        # Auth, Group, Contribution, Payout, and Audit controllers
│   │   ├── middleware/         # Auth, RBAC group guards, error handler, rate limiter
│   │   ├── routes/             # REST endpoints mounted at /api/v1/*
│   │   ├── services/           # Group, Contribution, Payout, Report, and Audit business logic
│   │   └── utils/              # Standardized AppError hierarchy
│   ├── tests/                  # Vitest unit & integration test suite (100% passing)
│   └── tsconfig.json
│
├── shared/                     # Shared TypeScript Library
│   ├── src/index.ts            # Domain enums, financial math utils, and Zod DTO schemas
│   └── tsconfig.json
│
├── docs/                       # Official Documentation Baseline
│   ├── EthioEqub_Digital_Management_System_PRTDD.pdf  # 50-Page Print-Ready PDF
│   └── EthioEqub_Digital_Management_System_PRTDD.html # Document HTML Source
│
├── scripts/                    # Development & Diagnostic Scripts
│   ├── verify_prerequisites.sh # Safe read-only system diagnostic tool
│   ├── start_postgres.sh       # Starts local PostgreSQL daemon on /tmp port 5436
│   └── start_dev.sh            # One-click launcher for server and client
│
├── docker-compose.yml          # Container configuration for external PostgreSQL deployment
└── package.json                # Monorepo workspaces coordinator
```

---

## 3. Seeded Demo Accounts

The database is pre-populated with authentic demonstration accounts. All accounts share the password: `password123`.

| Full Name | Role in Bole Equb | Email Address | Description |
|---|---|---|---|
| **Wagnew Nigussie** | Group Owner | `wagnewnigussie569@gmail.com` | Organizer of Bole Merchants Equb. Full administrative permissions. |
| **Tigist Haile** | Group Treasurer | `tigist@gmail.com` | Records contributions, executes adjustments, authorizes payouts (Approver 1). |
| **Chala Tadesse** | Member | `chala@gmail.com` | Active member; paid Cycle 1, 2, and 3 via CBE Birr. |
| **Marta Bekele** | Member | `marta@gmail.com` | Active member; paid Cycle 1 & 2; Cycle 3 contribution pending. |
| **System Admin** | Platform Admin | `admin@ethioequb.com` | Platform oversight and full audit log explorer. |

*Quick Access: The login page includes one-click buttons to sign in as any demo user instantly.*

---

## 4. Quick Start & Execution Guide

### 1. Start the PostgreSQL Database
```bash
./scripts/start_postgres.sh
```
*Output: `/tmp:5436 - accepting connections`*

### 2. Run the Development Servers
```bash
./scripts/start_dev.sh
```
Or run individually:
- **Backend API:** `npm run dev:server` (Listening at `http://localhost:5000`)
- **Frontend App:** `npm run dev:client` (Listening at `http://localhost:5173`)

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 10 unit and integration tests across financial arithmetic, cycle schedule algorithms, and API endpoints.*

### 4. Build Full Monorepo for Production
```bash
npm run build
```
*Compiles `@ethioequb/shared`, bundles backend `server`, and generates optimized production assets in `client/dist/`.*

---

## 5. Security & Financial Integrity Enforcements

- **BOLA / IDOR Defense:** `requireGroupRole` middleware verifies that the authenticated user holds an active membership and role in the requested group before fulfilling requests.
- **Anti-XSS Session Handling:** Authentication tokens are stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies inaccessible to JavaScript.
- **Double Approver Constraint:** The system strictly rejects attempts where `Approver 1 ID == Approver 2 ID`.
- **CSV Formula Injection Sanitization:** Cells starting with `=, +, -, @` are prepended with a single quote.
- **ACID Transaction Boundaries:** Multi-record financial mutations are wrapped in `prisma.$transaction`.

---

## 6. Project Documentation

The complete **Project Requirements and Technical Design Document (PRTDD v1.1)** is available at:
- **PDF File:** [`docs/EthioEqub_Digital_Management_System_PRTDD.pdf`](./docs/EthioEqub_Digital_Management_System_PRTDD.pdf)
- **HTML Source:** [`docs/EthioEqub_Digital_Management_System_PRTDD.html`](./docs/EthioEqub_Digital_Management_System_PRTDD.html)

---

## 7. Author & Project Ownership

- **Lead Software Engineer & Author:** Wagnew Nigussie
- **Email:** `wagnewnigussie569@gmail.com`
- **Project Repository:** EthioEqub Digital Management System


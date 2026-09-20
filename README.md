# 🚢 Nagarkot Forwarders — Global Logistics Command Center

> **A next-generation, enterprise-grade freight tracking and operations platform** — built for extreme clarity, real-time telemetry, and full audit trail integrity across every intermodal corridor on earth.

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| 🖥️ **Frontend** | [https://nagarkot-forwaders-krutarth-ashar.vercel.app](https://nagarkot-forwaders-krutarth-ashar.vercel.app) |
| ⚙️ **Backend API** | [https://nagarkot-forwaders.onrender.com](https://nagarkot-forwaders.onrender.com) |

> 🔐 **Demo Login:** `admin@nagarkot.com` / `123456`

---

## ⚡ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React + Vite + TypeScript | Component-driven UI with lightning-fast HMR and optimized production builds |
| **Styling** | Tailwind CSS | Utility-first framework — enabled the glassmorphic, dark-mode UI without sprawling stylesheets |
| **Backend** | Node.js + Express + TypeScript | Non-blocking I/O perfect for concurrent telemetry fetches and status updates |
| **Database** | PostgreSQL (Supabase) | Relational integrity with foreign-key-enforced audit ledgers and connection pooling via pgBouncer |
| **Auth** | Firebase Authentication | Battle-tested email/password and OAuth with JWT token exchange to the backend |
| **Hosting** | Vercel (FE) + Render (BE) | Zero-config deployment pipelines with auto-deploy on every `git push` |

---

## 🚀 Running Locally

### 1. Clone & Install

```bash
git clone https://github.com/krutarth3238/nagarkot-forwaders.git
cd nagarkot-forwaders
```

### 2. Configure Environment Variables

**Backend** — create `node-backend/.env`:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUPABASE-HOST]:6543/postgres
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=5000
```

**Frontend** — create `fontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Start the Backend

```bash
cd node-backend
npm install
npm run dev
# → Running on http://localhost:5000
```

### 4. Start the Frontend

```bash
cd fontend
npm install
npm run dev
# → Running on http://localhost:3000
```

---

## 🏗️ Architecture & Key Assumptions

- **Data Model:** One-to-many between `shipments` and `shipment_history`. The `shipments` table holds current state for fast dashboard queries; `shipment_history` is an **append-only ledger** — every status change is timestamped and immutable.
- **Status Flow:** Statuses transition sequentially (`Booked → In Transit → Customs Hold → Delivered`). Every update instantly appends a cryptographic event to the audit trail.
- **Auth Flow:** Firebase issues a JWT `idToken` on login → frontend exchanges it with the backend `/api/auth/session` → backend verifies via `firebase-admin` and creates/fetches the user record from Postgres.
- **Connection Pooling:** Supabase's IPv4-compatible pgBouncer pooler (port `6543`) is used on Render to avoid IPv6 `ENETUNREACH` failures on the free tier.

---

## 📈 Scaling Roadmap

> *What would change if this needed to handle 10,000+ shipments and hundreds of concurrent users?*

- **Pagination & Indexing** — Add `LIMIT/OFFSET` or cursor-based pagination + B-tree indexes on `status`, `mode`, and `user_id` to avoid full-table scans.
- **Real-time Updates** — Replace manual refreshes with **WebSockets** (Socket.io) so every connected dashboard instantly reflects status changes pushed by any operator.
- **Caching Layer** — Introduce **Redis** for KPI aggregations (active shipments, customs holds count) — computing these over 10K+ rows per request would quickly become a database bottleneck.
- **Queue-based Status Updates** — Route status changes through a job queue (e.g. BullMQ) to decouple write latency from the API response and guarantee history event ordering under concurrent updates.

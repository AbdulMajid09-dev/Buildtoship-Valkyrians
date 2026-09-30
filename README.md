# AI-Powered Agriculture Crop Advisory Assistant

A production-grade, full-stack, AI-powered agricultural advisory platform designed to provide evidence-aware, practical agronomic guidance for farmers, agronomists, and crop managers based on user-supplied field observations, soil conditions, irrigation methods, and environmental indicators.

Built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, **PostgreSQL**, and Google's official **@google/genai SDK** with strict **Zod** schema validation and agricultural safety guardrails.

---

## 🌾 Key Product Capabilities

- **Farmer Telemetry & Crop Input:** Detailed capture of crop category, variety, phenological growth stage, soil type/moisture/pH, irrigation methods, recent rainfall, temperature/humidity, visual symptoms, affected percentage, and pesticide/fertilizer history.
- **Evidence-Aware AI Advisory Engine:** Formulates structured agricultural guidance using Google's Gemini AI server-side, validated strictly against Zod schemas.
- **Agronomic Safety Guardrails:** Explicitly communicates uncertainty; never hallucinates pesticide dosages, chemical concentrations, or artificial measurements; enforces protective equipment (PPE) guidelines and provides clear thresholds for local agricultural extension escalation.
- **Row-Level Data Isolation:** Strictly enforced server-side data isolation ensuring farmers only access, view, or manage their own agricultural holdings and history.
- **Interactive Farmer Dashboard:** Telemetry tracking total advisories, crops analyzed, high-risk alerts, and recent diagnoses.
- **Advisory History & Detailed Reports:** Complete historical record with search, risk-level filters, print/PDF export, and farmer rating/feedback mechanism.
- **Dual PostgreSQL Architecture:** Seamlessly connects to standard PostgreSQL (Neon, Supabase, Railway, local Postgres) when `DATABASE_URL` is set, or automatically boots embedded PostgreSQL (PGlite) for instant zero-dependency local execution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, React Router v7, Tailwind CSS, Lucide React, Vite |
| **Backend** | Node.js, Express.js, TypeScript, Helmet, CORS, Express-Rate-Limit, Cookie-Parser, BCrypt.js, JSON Web Tokens |
| **Database** | PostgreSQL, PGlite (Embedded WASM Postgres engine), Parameterized SQL, UUID Keys |
| **AI Engine** | Google Gemini (`@google/genai` official SDK), Structured Output, Low-temperature deterministic extraction |
| **Validation** | Zod (Request, Response, Environment, Query, and AI Schema Validation) |
| **Testing** | Vitest, Supertest (100% automated test suite passing) |

---

## 📁 Repository Structure

```text
├── client/                      # React frontend
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── advisory/        # AdvisoryForm, AdvisoryResultView, AdvisoryLoadingState
│       │   ├── auth/            # ProtectedRoute
│       │   ├── layout/          # Navbar, Footer, AppLayout, PublicLayout
│       │   └── ui/              # Button, Input, Select, Textarea, Card, Badge, Modal, Alert, Skeleton
│       ├── context/             # AuthContext (JWT/Cookie session management)
│       ├── pages/               # Landing, Login, Register, Dashboard, NewAdvisory, Advisories, Detail, Profile, Legal
│       ├── services/            # api.ts (Typed API abstraction)
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css            # Tailwind directives, print optimization, focus rings
├── server/                      # Node.js Express backend
│   ├── controllers/             # authController.ts, advisoryController.ts
│   ├── middleware/              # auth.ts, validation.ts, errorHandler.ts
│   ├── routes/                  # authRoutes.ts, advisoryRoutes.ts
│   ├── services/                # geminiService.ts, advisoryService.ts, authService.ts
│   ├── db/                      # connection.ts, migrate.ts
│   ├── schemas/                 # env.ts
│   ├── utils/                   # jwt.ts
│   ├── app.ts                   # Express app configuration & middleware
│   └── server.ts                # Bootstrap & graceful shutdown
├── shared/                      # Shared types, schemas, and agricultural constants
│   ├── constants/               # Growth stages, soil types, irrigation methods, severities
│   ├── schemas/                 # Zod schemas for auth and advisory requests/responses
│   ├── types/                   # TypeScript interfaces and database entities
│   └── index.ts                 # Clean barrel export
├── tests/                       # Automated Vitest integration tests
│   └── advisory_workflow.test.ts
├── database.sql                 # Production PostgreSQL DDL schema
├── vite.config.ts               # Vite configuration with aliases & dev proxy
├── tailwind.config.js           # Agricultural & earth tone theme configuration
└── package.json                 # Unified scripts and dependencies
```

---

## 🗄️ Database Schema

The database consists of 4 core tables with UUID primary keys and cascading foreign keys:

1. **`users`**: Farmer credentials, email, hashed passwords, full name, preferred language, timestamps.
2. **`advisory_requests`**: Comprehensive user inputs (crop, growth stage, soil, moisture, irrigation, weather, symptoms, problem description).
3. **`advisory_results`**: Structured AI response (situation summary, crop assessment, possible causes, immediate actions, irrigation recommendations, soil recommendations, pest/disease considerations, preventive measures, monitoring checklist, severity, confidence, warnings, expert escalation guidance).
4. **`advisory_feedback`**: Farmer rating (1–5 stars) and outcome comments.

Indexes are created on `user_id`, `created_at`, `crop_name`, `severity`, and foreign keys.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=
GEMINI_API_KEY=your-gemini-api-key-here
SESSION_SECRET=agri-advisory-secret-key-32-chars-minimum-prod-key
FRONTEND_URL=http://localhost:5173
GEMINI_MODEL=gemini-2.5-flash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=150
```

> **Note**: If `DATABASE_URL` is omitted, the application automatically uses embedded PostgreSQL (`PGlite`), requiring zero database configuration. If `GEMINI_API_KEY` is omitted, the application automatically employs the built-in Agricultural Expert Advisory Engine fallback, guaranteeing uninterrupted functionality.

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration (Optional, runs automatically on startup)
```bash
npm run db:migrate
```

### 3. Run Development Servers
- **Full Backend API & Production Client (Port 5000):**
  ```bash
  npm run dev
  ```
- **Vite Frontend with Hot Module Reloading (Port 5173):**
  ```bash
  npm run dev:client
  ```

Access the app at:
- **Frontend (Vite Dev Server):** [http://localhost:5173](http://localhost:5173)
- **Backend / Production App:** [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing and Verification

Run the automated integration test suite:
```bash
npm test
```

Run TypeScript type checks:
```bash
npm run lint
```

Build production client and server bundles:
```bash
npm run build
```

Run production build:
```bash
npm start
```

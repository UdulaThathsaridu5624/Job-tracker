# JobTracker

A full-stack job application tracker to manage your job search — log applications, track statuses, store job descriptions, and monitor follow-up dates.

## Features

- **Authentication** — Register and login with JWT-based auth; auto-logout on token expiry
- **Application management** — Create, view, edit, and delete job applications
- **Status tracking** — Applied, Interview, Offer, Rejected, Withdrawn
- **Rich job descriptions** — Paste from LinkedIn/Indeed and formatting (bold, bullets, headings) is preserved via clipboard HTML → Markdown conversion
- **Dashboard** — Overview stats grouped by status
- **Search & pagination** — Search applications by company name; paginated card grid
- **Dark mode** — Toggle between light and dark theme, persisted to localStorage
- **Security** — Rate limiting on auth endpoints, CORS origin restriction, security headers via Helmet, body size limit, hidden server error details

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- Radix UI Themes v3 (component library)
- TanStack Query v5 (server state)
- React Hook Form v7 (forms)
- React Router v6 (routing)
- axios (HTTP client)
- lucide-react (icons)
- react-markdown (render job descriptions)
- turndown (clipboard HTML → Markdown)

**Backend**
- Node.js + Express + TypeScript (ESM)
- Prisma 7 ORM with PrismaPg driver adapter
- PostgreSQL via Supabase (pooled connection)
- jsonwebtoken + bcryptjs (auth)
- helmet + express-rate-limit (security)

## Project Structure

```
Job-tracker/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # axios instance + interceptors
│   │   ├── components/      # Navbar, StatusBadge
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── lib/             # pasteHandler (clipboard → markdown)
│   │   └── pages/           # Login, Register, Dashboard, Applications, AddApplication, ApplicationDetail
│   └── .env                 # VITE_API_URL (not committed)
└── server/                  # Express backend
    ├── prisma/
    │   └── schema.prisma    # User + Application models
    └── src/
        ├── controllers/     # auth, application
        ├── middleware/      # auth (JWT verify), error handler
        ├── routes/          # auth, application routes
        └── services/        # auth, application (Prisma queries)
```

## Local Development

### Prerequisites
- Node.js 18+
- pnpm
- A Supabase project with a PostgreSQL database

### Backend

```bash
cd server
npm install
```

Create `server/.env`:
```
DATABASE_URL="your-supabase-pooled-connection-string"
DIRECT_URL="your-supabase-direct-connection-string"
JWT_SECRET="a-random-string-at-least-32-characters"
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd client
pnpm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

```bash
pnpm dev
```

App runs at `http://localhost:5173`.

## Deployment

**Backend → Render**

Set these environment variables in Render:
- `DATABASE_URL` — Supabase pooled URL
- `DIRECT_URL` — Supabase direct URL (for migrations)
- `JWT_SECRET` — strong random string (32+ chars)
- `PORT` — set automatically by Render
- `CLIENT_URL` — your deployed frontend URL (no trailing slash)

Run migrations in production:
```bash
npx prisma migrate deploy
```

**Frontend → Vercel**

- Root directory: `client`
- Build command: `pnpm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` = your Render backend URL

## Database Schema

```
User
  id, name, email (unique), password (hashed), createdAt

Application
  id, userId (FK), jobTitle, company, location?,
  status (APPLIED | INTERVIEW | OFFER | REJECTED | WITHDRAWN),
  notes?, jobDescription?, appliedDate, followUpDate?, createdAt, updatedAt
```

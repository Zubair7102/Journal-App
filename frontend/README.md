# Journal App Frontend

React + TypeScript + Material UI client for the Journal App Spring Boot backend.

## Prerequisites

- Node.js 20+
- Backend running on `http://localhost:8081` with `dev` profile

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` to the backend (`vite.config.ts`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base URL (default `/api` for local proxy) |

For production, set `VITE_API_BASE_URL` to your deployed API URL and configure backend CORS.

## Features (Phase 1)

- Login / signup
- JWT session storage
- Dashboard with weather greeting
- Journal list, create, edit, delete
- Profile update and account deletion
- Admin users table (ADMIN role)
- OAuth callback route (`/oauth/callback`)

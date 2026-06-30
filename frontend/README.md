# Journal App Frontend

Premium React UI for the Journal App Spring Boot backend.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — design system, light/dark themes
- **Framer Motion** — animations
- **Lucide React** — icons
- **TanStack Query** — server state
- **Sonner** — toast notifications
- **cmdk** — command palette (⌘K)

## Features

- Dashboard with stats, mood tracker, recent activity
- Journal cards with hover animations, favorites, tags, categories
- Rich editor with markdown toolbar, live preview, mood, tags, focus & fullscreen modes
- Google OAuth sign-in (when backend credentials are configured)
- Dedicated logout button in sidebar, header, and settings
- Scroll progress bar and back-to-top button
- Code-split routes for faster initial load
- Search, filter, and sort journals
- Favorites, trash (soft delete), calendar view
- Dark/light theme with localStorage persistence
- Settings (profile, theme, export metadata)
- Admin users table (ADMIN role)
- Command palette navigation

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

- Frontend: http://localhost:5173
- API proxy: `/api` → http://localhost:8081

Ensure the backend runs with `dev` profile.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Notes

- **Favorites, tags, trash, categories** are stored in browser `localStorage` (backend unchanged).
- **Mood** maps to backend `sentiment` when supported (`HAPPY`, `SAD`, `ANGRY`, `ANXIOUS`).
- **Weather greet** requires backend `WEATHER_API_KEY` and MongoDB config.

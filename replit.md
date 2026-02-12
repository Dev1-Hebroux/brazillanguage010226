# Horizonte English Community

## Overview

Horizonte English Community ("Horizonte Café") is a web application for a free English learning community based in Brasília, Brazil. The platform supports cohort-based English courses at different CEFR levels (A1 through Advanced), English Café in-person meetup events, community building, and learning resources. It is an initiative of RCCG Brazil with the tagline "Speak. Connect. Grow."

The app allows users to browse cohort tracks, apply to join cohorts, RSVP for English Café events, access learning resources, view a cohort dashboard with weekly curriculum progress, and submit contact messages. It supports English and Portuguese (i18n).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Monorepo Structure

The project uses a single repository with three main directories:
- `client/` — React SPA (frontend)
- `server/` — Express.js API (backend)
- `shared/` — Shared TypeScript types and database schema (used by both client and server)

### Frontend

- **Framework:** React with TypeScript (no SSR, `rsc: false`)
- **Routing:** Wouter (lightweight client-side router)
- **State/Data Fetching:** TanStack React Query for server state management
- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite` plugin, CSS variables for theming, custom Brazil-inspired color theme
- **UI Components:** shadcn/ui (new-york style) built on Radix UI primitives. Components live in `client/src/components/ui/`
- **Fonts:** DM Sans (body) and Outfit (headings) via Google Fonts
- **i18n:** Custom context-based translation system in `client/src/lib/i18n.tsx` supporting English (`en`) and Portuguese (`pt`)
- **Auth Context:** Client-side auth state managed via React Context in `client/src/lib/auth.tsx`, communicating with session-based server auth
- **Build Tool:** Vite with React plugin, path aliases (`@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`)

**Key Pages:**
- `Home` — Landing page with hero, how-it-works, about section
- `Cohorts` — Browse available English tracks/cohorts
- `CohortDetail` — Detailed view of a specific track with curriculum and application form
- `CohortDashboard` — Weekly progress dashboard for enrolled learners (currently uses simulated progress data)
- `Events` — English Café events listing with RSVP functionality
- `Resources` — Placement tools, lessons, downloads
- `Community` — Community values and information
- `Auth` — Login/register page
- `Tasters` — Interactive Week 1 taster modules with MCQ + fill-in activities, bilingual scaffolding (PT-BR + ES-LA), track filter pills, and speaking prompts

### Backend

- **Framework:** Express.js with TypeScript, run via `tsx`
- **Session Management:** `express-session` with `connect-pg-simple` (sessions stored in PostgreSQL)
- **Authentication:** Custom session-based auth with bcrypt password hashing. Routes in `server/auth.ts` handle register, login, logout, and session check (`/api/auth/*`)
- **API Routes:** RESTful JSON API defined in `server/routes.ts`
  - `POST /api/cohort-applications` — Submit cohort application
  - `GET /api/cohort-applications` — List all applications
  - `GET /api/events` — List events
  - `POST /api/events/:id/rsvp` — RSVP to an event
  - `POST /api/contact` — Submit contact message
- **Storage Layer:** `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation using Drizzle ORM. This abstraction makes it easy to swap storage backends.
- **Static Serving:** In production, `server/static.ts` serves the built Vite output from `dist/public/` with SPA fallback. In development, `server/vite.ts` sets up Vite's dev server as middleware with HMR.

### Database

- **ORM:** Drizzle ORM with PostgreSQL dialect
- **Schema:** Defined in `shared/schema.ts` using Drizzle's `pgTable` helpers with Zod validation schemas generated via `drizzle-zod`
- **Tables:**
  - `users` — id (UUID), username, password (hashed)
  - `cohort_applications` — id, fullName, email, phone, trackId, englishLevel, motivation, status, createdAt
  - `events` — id, title, description, date, time, location, locationDetail, maxSpots, isActive
  - `event_rsvps` — RSVP records linked to events
  - `contact_messages` — Contact form submissions
- **Connection:** `db/index.ts` creates a `pg.Pool` from `DATABASE_URL` environment variable
- **Migrations:** Drizzle Kit configured in `drizzle.config.ts`, migrations output to `./migrations/`. Use `npm run db:push` to push schema changes.

### Build & Deployment

- **Development:** `npm run dev` starts the Express server with Vite middleware (HMR enabled) via `tsx`
- **Production Build:** `npm run build` runs `script/build.ts` which:
  1. Builds the client with Vite (output to `dist/public/`)
  2. Bundles the server with esbuild (output to `dist/index.cjs`), externalizing most dependencies except an allowlist
- **Production Start:** `npm start` runs `node dist/index.cjs`

### Curriculum Data

Cohort curriculum data is defined client-side in `client/src/data/curriculum.ts` as TypeScript types and static data. Each track has weekly content including language focus areas, daily prompts, session flow steps, and resources.

## External Dependencies

### Database
- **PostgreSQL** — Primary data store. Required via `DATABASE_URL` environment variable. Used for application data (Drizzle ORM) and session storage (`connect-pg-simple`).

### Key NPM Packages
- **drizzle-orm / drizzle-kit** — Database ORM and migration tooling
- **express / express-session** — HTTP server and session management
- **bcrypt** — Password hashing
- **connect-pg-simple** — PostgreSQL session store for Express
- **@tanstack/react-query** — Server state management on the client
- **wouter** — Client-side routing
- **zod / drizzle-zod** — Schema validation
- **shadcn/ui ecosystem** — Radix UI primitives, class-variance-authority, clsx, tailwind-merge, lucide-react icons
- **react-day-picker** — Calendar component
- **embla-carousel-react** — Carousel component
- **vaul** — Drawer component
- **cmdk** — Command palette component
- **recharts** — Charting library

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Secret for signing session cookies (has a default fallback, should be set in production)

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay in development
- `@replit/vite-plugin-cartographer` — Dev-only Replit integration
- `@replit/vite-plugin-dev-banner` — Dev-only banner
- Custom `vite-plugin-meta-images` — Updates OpenGraph meta tags with the correct Replit deployment domain
# AGENTS.md

## Stack

Next.js 16 App Router (React 19), TypeScript, Drizzle ORM, PostgreSQL, Better Auth, shadcn/ui (Radix Nova style), Tailwind CSS v4

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Build production
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Apply migrations
- `npm run db:studio` - Open Drizzle Studio

**Command order for verification:** `lint` before committing

## Project Structure

- `app/` - Next.js App Router pages
  - `(home)/` - Public routes (booking, pelatihan, riwayat-booking)
  - `(admin)/admin/` - Admin routes (booking, pelatihan, pengaturan)
  - `api/auth/[...all]/` - Better Auth API handler
  - `login/` - Login page
- `components/` - React components
  - `ui/` - shadcn/ui components
  - `form/` - Form components
  - `calendar/` - Calendar components
- `lib/` - Business logic and utilities
  - `env.ts` - Environment config with fallbacks
  - `auth.ts` - Better Auth setup
  - `booking-*.ts` - Booking domain logic
  - `pelatihan.ts` - Training (pelatihan) logic
- `db/` - Database layer
  - `schema.ts` - Drizzle schema (users, sessions, bookings, trainings, appSettings)
  - `index.ts` - DB connection
- `hooks/` - React hooks

## Database

Drizzle ORM with PostgreSQL. Schema at `db/schema.ts`. Neon serverless driver used.

**Migration workflow:**
1. Edit `db/schema.ts`
2. `npm run db:generate` to create migration
3. `npm run db:migrate` to apply

## Auth

Better Auth with Drizzle adapter. Email/password + Google OAuth. User roles: `user`, `admin`.

Session access: `import { getSession } from "@/lib/auth"` (server) or `import { authClient } from "@/lib/auth-client"` (client).

## Environment

Required vars in `.env` (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret
- `BETTER_AUTH_URL` - Base URL (e.g., http://localhost:3000)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth

Fallbacks exist in `lib/env.ts` for local dev.

## Styling

- Tailwind CSS v4 with `@tailwindcss/postcss`
- shadcn/ui components (Radix Nova style, `lucide-react` icons)
- Path alias: `@/*` maps to project root
- No `tailwind.config` file - CSS-first Tailwind v4 configuration
- Global styles in `app/globals.css`

## Conventions

- TypeScript strict mode disabled (`tsconfig.json`)
- Indonesian language used in UI and route names
- RSC-first architecture (use "use client" explicitly for client components)
- No test framework configured
- Component aliasing via `@/components`, `@/lib`, `@/hooks`

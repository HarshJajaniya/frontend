# MeetMOM AI

MeetMOM AI is a full-stack meeting assistant that helps teams schedule meetings, create Google Meet links, transcribe recordings, generate minutes of meeting (MoM) with AI, and track action items as tasks and projects.

## Live URLs

- Frontend: https://frontend-rho-one-95.vercel.app
- Privacy Policy: https://frontend-rho-one-95.vercel.app/privacy
- Terms of Service: https://frontend-rho-one-95.vercel.app/terms

## Monorepo Structure

- meetmom-frontend: Next.js app (UI)
- meetmom-backend: Express + Prisma API
- ai-services: AI-related services and integrations
- frontend: Additional frontend workspace folder

## Core Features

- Google OAuth login
- Meeting scheduling with Google Calendar + Google Meet link generation
- AI-generated meeting summaries (MoM)
- Audio upload and transcription flow
- Task management linked to meetings and projects
- Project management with linked meetings/tasks
- User profile settings, avatar upload, and notifications preferences
- Privacy and Terms pages for compliance

## Tech Stack

Frontend:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios

Backend:
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Passport Google OAuth 2.0
- Google Calendar API

AI/Automation:
- Gemini / OpenRouter / Groq integrations (based on configured keys)

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (or Neon connection string)
- Google Cloud OAuth credentials

## Environment Variables

Create env files before running locally.

Backend file: meetmom-backend/src/.env

Required variables:
- DATABASE_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL
- SESSION_SECRET
- CLIENT_URL

Optional AI/API keys (used by services if enabled):
- GEMINI_API_KEY
- OPENROUTER_API_KEY
- GROQ_API_KEY

Frontend file: meetmom-frontend/src/.env

Required variables:
- NEXT_PUBLIC_API_URL

## Local Setup

### 1) Install dependencies

Backend:

```bash
cd meetmom-backend
npm install
```

Frontend:

```bash
cd meetmom-frontend
npm install
```

### 2) Prisma setup (backend)

```bash
cd meetmom-backend
npm run prisma:generate
npx prisma migrate deploy --schema=src/prisma/schema.prisma
```

For local development with schema changes:

```bash
npx prisma migrate dev --schema=src/prisma/schema.prisma
```

### 3) Run apps

Backend (port 8000):

```bash
cd meetmom-backend
npm run dev
```

Frontend (port 3000):

```bash
cd meetmom-frontend
npm run dev
```

Open: http://localhost:3000

## Build for Production

Frontend:

```bash
cd meetmom-frontend
npm run build
npm start
```

Backend:

```bash
cd meetmom-backend
npm run build
npm start
```

## API Overview

Main backend route groups:

- /auth: Google login, callback, logout, current user
- /meetings: create/list meeting, upload audio, generate MoM
- /tasks: create/update/list tasks
- /projects: create/list/link projects
- /api/user: user settings

Health route:

- /health

## Authentication Flow

1. Frontend redirects user to backend /auth/google.
2. Backend handles OAuth with Passport Google strategy.
3. User profile and tokens are upserted into the database.
4. Session cookie is used for authenticated API requests.

## Troubleshooting

- Login works for only one account:
  - Confirm OAuth consent screen user type and test users in Google Cloud.
  - Ensure callback URL exactly matches Google console settings.
- Meeting creation fails with time range error:
  - End time must be later than start time.
- Database connection errors:
  - Verify DATABASE_URL and database availability.

## Security Notes

- Do not commit real secrets to Git.
- Rotate exposed API keys and credentials immediately if they were committed.
- Use separate credentials for development and production.

## License

Add your preferred license (MIT, Apache-2.0, etc.).

## Made with ❤️ by Harsh Jajaniya

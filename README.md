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

## DevOps & Deployment

* Dockerized frontend and backend services for consistent development and production environments
* Docker Compose orchestration for multi-container deployment
* GitHub Actions CI/CD pipeline for automated build, test, and deployment workflows
* Docker Hub integration for automatic image publishing and version management
* AWS EC2 deployment for hosting containerized services
* Linux server administration and SSH-based infrastructure management
* Automated container updates through CI/CD workflows
* Environment-based configuration management for development and production deployments

## Deployment Architecture

```text
                        ┌─────────────────────┐
                        │      Developer      │
                        └──────────┬──────────┘
                                   │
                              Git Push
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │       GitHub        │
                        └──────────┬──────────┘
                                   │
                           GitHub Actions
                               (CI/CD)
                                   │
                  ┌────────────────┴────────────────┐
                  │                                 │
                  ▼                                 ▼
      ┌─────────────────────┐          ┌─────────────────────┐
      │  Backend Docker     │          │  Frontend Docker    │
      │    Image Build      │          │    Image Build      │
      └──────────┬──────────┘          └──────────┬──────────┘
                 │                                │
                 └──────────────┬─────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │     Docker Hub      │
                    │ Container Registry  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      AWS EC2        │
                    │ Docker Compose      │
                    │ Container Runtime   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                                   │
             ▼                                   ▼
 ┌─────────────────────┐              ┌─────────────────────┐
 │ MeetMOM Frontend    │              │ MeetMOM Backend     │
 │ Next.js + React     │◄────────────►│ Node.js + Express   │
 └─────────────────────┘              └──────────┬──────────┘
                                                  │
                                                  ▼
                                     ┌─────────────────────┐
                                     │ Neon PostgreSQL     │
                                     │     Database        │
                                     └─────────────────────┘
```

### Current Production Setup

```text
Frontend (Vercel)
        │
        ▼
MeetMOM Frontend (Next.js)
        │
        ▼
Backend API (Render)
        │
        ▼
Neon PostgreSQL
```

### DevOps Stack

* GitHub Actions for CI/CD automation
* Docker & Docker Compose for containerization
* Docker Hub for image registry and versioning
* AWS EC2 for container deployment and infrastructure
* Render for backend hosting
* Vercel for frontend hosting
* Neon PostgreSQL for managed database hosting
* Linux & SSH for server administration

```
```


### Infrastructure

* Frontend: Vercel
* Backend: Render
* Database: Neon PostgreSQL
* Container Registry: Docker Hub
* CI/CD: GitHub Actions
* Cloud Infrastructure: AWS EC2

## Security Notes

- Do not commit real secrets to Git.
- Rotate exposed API keys and credentials immediately if they were committed.
- Use separate credentials for development and production.

## License

Add your preferred license (MIT, Apache-2.0, etc.).

## Made with ❤️ by Harsh Jajaniya

# Momentum — Personal Productivity Dashboard

A sleek, dark-mode productivity dashboard built with **Next.js 14 App Router**, deployed on **Vercel**, with a **Neon Postgres** database.

## Features

- ✅ **Tasks** — Create, complete, filter, and delete tasks with priority levels
- 🔁 **Habits** — Track daily/weekly habits with 30-day heatmaps and streaks  
- 🎯 **Goals** — Set goals with progress tracking, units, and deadlines
- 📝 **Notes** — Masonry-layout notes with pin, edit, and color support
- ⏱️ **Pomodoro** — Focus timer with circular countdown, task linking, session history

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components, Route Handlers)
- **Database**: Neon Postgres via `@neondatabase/serverless`
- **Styling**: Tailwind CSS with custom design tokens
- **Deployment**: Vercel

---

## Setup & Deployment

### 1. Clone and install

```bash
git clone <your-repo>
cd productivity-dashboard
npm install
```

### 2. Create a Neon database

1. Go to [neon.tech](https://neon.tech) and sign up (free tier available)
2. Create a new project
3. Copy the **Connection String** from the dashboard (Connection Details tab)
4. It looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="your-neon-connection-string-here"
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database tables auto-create on first request.

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

When prompted, add your environment variable:
- `DATABASE_URL` = your Neon connection string

### Option B: Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variable: `DATABASE_URL` = your Neon connection string
4. Deploy

### Option C: Neon + Vercel Integration (recommended)

1. In Neon dashboard → **Integrations** → **Vercel**
2. Click **Connect** — this automatically sets `DATABASE_URL` in your Vercel project
3. No manual env var needed!

---

## Database Schema

Tables are auto-created on first API request via `initDB()`:

- `tasks` — title, description, priority, due_date, completed
- `habits` — name, frequency, color
- `habit_completions` — habit_id, completed_date (unique per day)
- `goals` — title, target/current value, unit, deadline, status, color  
- `notes` — title, content, pinned, color
- `pomodoro_sessions` — duration, task_id, completed, timestamps

---

## Project Structure

```
app/
  dashboard/
    page.tsx              # Overview (server component)
    tasks/page.tsx
    habits/page.tsx
    goals/page.tsx
    notes/page.tsx
    pomodoro/page.tsx
  api/
    tasks/route.ts        # GET, POST
    tasks/[id]/route.ts   # PATCH, DELETE
    habits/route.ts
    habits/[id]/route.ts
    habits/[id]/complete/route.ts
    goals/route.ts
    goals/[id]/route.ts
    notes/route.ts
    notes/[id]/route.ts
    pomodoro/route.ts
components/
  Sidebar.tsx
  dashboard/
    DashboardClient.tsx
    TasksClient.tsx
    HabitsClient.tsx
    GoalsClient.tsx
    NotesClient.tsx
    PomodoroClient.tsx
lib/
  db.ts                   # Neon connection + schema init
types/
  index.ts
```

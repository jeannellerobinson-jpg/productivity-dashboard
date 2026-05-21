import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
      due_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS habits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
      color TEXT DEFAULT '#C8FF00',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS habit_completions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
      completed_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(habit_id, completed_date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      target_value INTEGER NOT NULL DEFAULT 100,
      current_value INTEGER NOT NULL DEFAULT 0,
      unit TEXT DEFAULT '%',
      deadline TIMESTAMPTZ,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
      color TEXT DEFAULT '#00C8FF',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT,
      pinned BOOLEAN DEFAULT false,
      color TEXT DEFAULT '#1A1A26',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      duration_minutes INTEGER NOT NULL DEFAULT 25,
      break_minutes INTEGER NOT NULL DEFAULT 5,
      completed BOOLEAN DEFAULT false,
      task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;
}

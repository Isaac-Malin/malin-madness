// lib/migrate.js
// Run with: npm run db:migrate
// This creates all required tables in your Vercel Postgres database.

const { sql } = require('@vercel/postgres');

async function migrate() {
  console.log('🚀 Running migrations...');

  await sql`
    CREATE TABLE IF NOT EXISTS media (
      id          SERIAL PRIMARY KEY,
      public_id   TEXT NOT NULL UNIQUE,
      url         TEXT NOT NULL,
      thumb_url   TEXT NOT NULL,
      name        TEXT NOT NULL,
      media_type  TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
      width       INTEGER,
      height      INTEGER,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✅ media table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id         SERIAL PRIMARY KEY,
      title      TEXT NOT NULL,
      event_date DATE NOT NULL,
      type       TEXT NOT NULL CHECK (type IN ('birthday', 'gathering', 'vacation')),
      notes      TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log('✅ events table ready');

  console.log('🎉 All migrations complete!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

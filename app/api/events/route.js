// app/api/events/route.js
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET — fetch all events (optionally filtered by year/month)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year  = searchParams.get('year');
    const month = searchParams.get('month'); // 1-12

    let rows;
    if (year && month) {
      ({ rows } = await sql`
        SELECT * FROM events
        WHERE EXTRACT(YEAR  FROM event_date) = ${year}
          AND EXTRACT(MONTH FROM event_date) = ${month}
        ORDER BY event_date ASC;
      `);
    } else {
      ({ rows } = await sql`SELECT * FROM events ORDER BY event_date ASC;`);
    }

    return NextResponse.json({ events: rows });
  } catch (err) {
    console.error('GET /api/events error:', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST — create a new event
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, event_date, type, notes } = body;

    if (!title || !event_date || !type) {
      return NextResponse.json({ error: 'title, event_date and type are required' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO events (title, event_date, type, notes)
      VALUES (${title}, ${event_date}, ${type}, ${notes ?? null})
      RETURNING *;
    `;

    return NextResponse.json({ event: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST /api/events error:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

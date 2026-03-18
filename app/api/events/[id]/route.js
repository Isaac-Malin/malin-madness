// app/api/events/[id]/route.js
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// PUT — update an existing event
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, event_date, type, notes } = body;

    if (!title || !event_date || !type) {
      return NextResponse.json({ error: 'title, event_date and type are required' }, { status: 400 });
    }

    const { rows } = await sql`
      UPDATE events
      SET title      = ${title},
          event_date = ${event_date},
          type       = ${type},
          notes      = ${notes ?? null},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!rows.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: rows[0] });
  } catch (err) {
    console.error('PUT /api/events/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE — remove an event
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { rows } = await sql`DELETE FROM events WHERE id = ${id} RETURNING id;`;

    if (!rows.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/events/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

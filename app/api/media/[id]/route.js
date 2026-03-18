// app/api/media/[id]/route.js
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { sql } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Fetch the record so we can delete from Cloudinary too
    const { rows } = await sql`SELECT * FROM media WHERE id = ${id};`;
    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const record = rows[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(record.public_id, {
      resource_type: record.media_type === 'video' ? 'video' : 'image',
    });

    // Delete from Postgres
    await sql`DELETE FROM media WHERE id = ${id};`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/media/[id] error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

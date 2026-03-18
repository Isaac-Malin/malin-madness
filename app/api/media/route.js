// app/api/media/route.js
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { sql } from '@/lib/db';

// GET — fetch all media ordered by newest first
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM media ORDER BY created_at DESC;
    `;
    return NextResponse.json({ media: rows });
  } catch (err) {
    console.error('GET /api/media error:', err);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// POST — upload file to Cloudinary then persist metadata
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isVideo = file.type.startsWith('video');

    // Upload to Cloudinary as a base64 data URI
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder:        'malin-madness',
      resource_type: isVideo ? 'video' : 'image',
      // Generate a thumbnail for videos automatically
      ...(isVideo && {
        eager: [{ width: 400, height: 300, crop: 'fill', format: 'jpg' }],
      }),
    });

    const thumbUrl = isVideo
      ? (uploadResult.eager?.[0]?.secure_url ?? uploadResult.secure_url)
      : uploadResult.secure_url;

    // Persist to Postgres
    const { rows } = await sql`
      INSERT INTO media (public_id, url, thumb_url, name, media_type, width, height)
      VALUES (
        ${uploadResult.public_id},
        ${uploadResult.secure_url},
        ${thumbUrl},
        ${file.name},
        ${isVideo ? 'video' : 'image'},
        ${uploadResult.width ?? null},
        ${uploadResult.height ?? null}
      )
      RETURNING *;
    `;

    return NextResponse.json({ media: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST /api/media error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

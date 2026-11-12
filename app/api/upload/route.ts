import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side env vars (never exposed to browser)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');
    const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');

    if (!isImage && !isAudio && !isPdf) {
      return NextResponse.json({ error: 'Only image, audio, and PDF files are allowed' }, { status: 400 });
    }

    // Max 20MB for PDFs, 15MB otherwise
    const maxBytes = isPdf ? 20 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `File too large. Max ${isPdf ? '20MB' : '15MB'}.` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary keys are present, upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const safeName = (file.name || 'document')
        .replace(/\.pdf$/i, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 50);

      const uploadOptions: Record<string, any> = isPdf
        ? {
            folder: 'bhashaschool/batch-pdfs',
            resource_type: 'raw',
            public_id: `${Date.now()}_${safeName}.pdf`,
          }
        : {
            folder: 'moneyhiest/uploads',
            resource_type: 'auto',
          };

      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error || !result) reject(error || new Error('Upload failed'));
              else resolve(result as { secure_url: string; public_id: string });
            }
          ).end(buffer);
        }
      );

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.name,
      });
    }

    // Fallback: Data URL if Cloudinary env vars are missing
    const mime = isPdf ? 'application/pdf' : (file.type || (isAudio ? 'audio/mpeg' : 'image/png'));
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${base64Data}`;

    return NextResponse.json({
      url: dataUrl,
      publicId: `local-${Date.now()}`,
      fileName: file.name,
    });
  } catch (err: any) {
    console.error('[Cloudinary Upload Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

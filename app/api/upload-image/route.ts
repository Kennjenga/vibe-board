import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/utils/image';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check if the request is JSON (URL upload) or FormData (file upload)
    const contentType = request.headers.get('content-type') || '';
    let imageInput: string;

    if (contentType.includes('application/json')) {
      // Handle URL upload
      const { url } = await request.json();

      if (!url) {
        return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
      }

      imageInput = url;
    } else {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
      }

      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Invalid file type. Must be an image.' }, { status: 400 });
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
      }

      // Convert File to a data URL string for uploadToCloudinary
      const arrayBuffer = await file.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString('base64');
      imageInput = `data:${file.type};base64,${base64String}`;
    }

    const imageURI = await uploadToCloudinary(imageInput);
    return NextResponse.json({ imageURI });
  } catch (error) {
    console.error('Error in upload-image API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

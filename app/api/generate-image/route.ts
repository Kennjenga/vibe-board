import { NextRequest, NextResponse } from 'next/server';
import { generateImageWithAI, generateGifWithAI } from '@/utils/image';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'image' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    if (prompt.length > 1000) {
      return NextResponse.json({ error: 'Prompt is too long. Maximum 1000 characters allowed.' }, { status: 400 });
    }

    let imageURI: string;
    
    if (type === 'gif') {
      imageURI = await generateGifWithAI(prompt);
    } else {
      imageURI = await generateImageWithAI(prompt);
    }

    return NextResponse.json({ imageURI });
  } catch (error) {
    console.error('Error in generate-image API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

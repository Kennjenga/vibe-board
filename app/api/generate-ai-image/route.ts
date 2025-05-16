import { NextRequest, NextResponse } from 'next/server';
import { generateImageWithAI, generateGifWithAI } from '@/utils/image'; // Assuming alias @ is configured for root

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageType } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided.' }, { status: 400 });
    }

    if (imageType !== 'image' && imageType !== 'gif') {
      return NextResponse.json({ error: 'Invalid imageType. Must be "image" or "gif".' }, { status: 400 });
    }

    let imageURI;
    if (imageType === 'image') {
      imageURI = await generateImageWithAI(prompt);
    } else {
      imageURI = await generateGifWithAI(prompt);
    }
    
    return NextResponse.json({ imageURI });
  } catch (error) {
    console.error('Error in generate-ai-image API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI image';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

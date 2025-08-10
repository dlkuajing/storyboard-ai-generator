import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/services/gemini';
import { GenerateRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    
    if (!body.script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    const geminiService = new GeminiService();
    const storyboard = await geminiService.generateStoryboard(body);
    
    return NextResponse.json({ storyboard });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate storyboard' },
      { status: 500 }
    );
  }
}
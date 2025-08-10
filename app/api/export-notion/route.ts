import { NextRequest, NextResponse } from 'next/server';
import { NotionService } from '@/lib/services/notion';
import { Storyboard } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { storyboard }: { storyboard: Storyboard } = await request.json();
    
    if (!storyboard) {
      return NextResponse.json(
        { error: 'Storyboard data is required' },
        { status: 400 }
      );
    }

    const notionService = new NotionService();
    const pageId = await notionService.exportToNotion(storyboard);
    
    return NextResponse.json({ 
      success: true, 
      pageId,
      message: '成功导出到Notion' 
    });
  } catch (error) {
    console.error('Export to Notion error:', error);
    return NextResponse.json(
      { error: 'Failed to export to Notion' },
      { status: 500 }
    );
  }
}
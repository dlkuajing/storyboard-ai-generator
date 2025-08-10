import { Client } from '@notionhq/client';
import { Storyboard, Shot } from '../types';

export class NotionService {
  private notion: Client;
  private databaseId: string;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
      timeoutMs: 30000, // 增加超时时间到30秒
    });
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
  }

  async exportToNotion(storyboard: Storyboard): Promise<string> {
    try {
      const pageId = await this.createStoryboardPage(storyboard);
      // 移除单独创建镜头页面的功能，所有信息都在主页面中
      return pageId;
    } catch (error) {
      console.error('Notion export error:', error);
      throw new Error('Failed to export to Notion');
    }
  }

  private async createStoryboardPage(storyboard: Storyboard): Promise<string> {
    const response = await this.notion.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Name': {
          title: [
            {
              text: {
                content: storyboard.title || '未命名分镜',
              },
            },
          ],
        },
        'Script': {
          rich_text: [
            {
              text: {
                content: storyboard.script,
              },
            },
          ],
        },
        'Total Duration': {
          number: storyboard.totalDuration,
        },
        'Created Date': {
          date: {
            start: new Date(storyboard.createdAt).toISOString(),
          },
        },
      },
      children: this.formatShotsAsBlocks(storyboard.shots),
    });

    return response.id;
  }

  private formatShotsAsBlocks(shots: Shot[]) {
    const blocks: any[] = [];

    // 1. 添加概览信息
    blocks.push(
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: '📋 分镜脚本详情' } }],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{ 
            type: 'text', 
            text: { content: `共 ${shots.length} 个镜头 | 总时长 ${shots.reduce((sum, s) => sum + s.duration, 0)} 秒` } 
          }],
          icon: { emoji: '🎬' },
        },
      }
    );

    // 2. 创建分镜快速索引表（使用代码块模拟表格）
    const tableHeader = '镜头 | 时长 | 景别 | 旁白摘要';
    const tableDivider = '---|---|---|---';
    const tableRows = shots.map(shot => 
      `#${shot.shotNumber} | ${shot.duration}秒 | ${shot.shotType} | ${(shot.narration || '').substring(0, 30)}...`
    );
    
    const tableContent = [tableHeader, tableDivider, ...tableRows].join('\n');

    blocks.push(
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📊 分镜索引表' } }],
        },
      },
      {
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: tableContent } }],
          language: 'markdown',
        },
      }
    );

    // 3. 分组显示详细镜头信息（每10个镜头一组，避免超限）
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🎬 详细分镜信息' } }],
      },
    });

    const groupSize = 10;
    for (let i = 0; i < shots.length; i += groupSize) {
      const group = shots.slice(i, Math.min(i + groupSize, shots.length));
      
      // 分组标题
      if (shots.length > groupSize) {
        blocks.push({
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ 
              type: 'text', 
              text: { content: `镜头 ${i + 1} - ${Math.min(i + groupSize, shots.length)}` } 
            }],
          },
        });
      }

      // 将每组镜头合并为一个文本块
      const groupText = group.map(shot => 
        `【镜头 ${shot.shotNumber}】${shot.duration}秒 - ${shot.shotType}\n` +
        `📝 旁白：${shot.narration || '无'}\n` +
        `🎥 画面：${shot.visualDescription}\n` +
        `📹 运镜：${shot.cameraMovement} | 💡 灯光：${shot.lightingNotes}\n` +
        `🎯 营销策略：${shot.marketingPoint || '无'}\n` +
        `📈 情绪：${shot.emotionCurve}`
      ).join('\n\n---\n\n');

      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ 
            type: 'text', 
            text: { content: groupText }
          }],
        },
      });
    }

    // 确保总块数不超过90个（留10个余量）
    if (blocks.length > 90) {
      // 如果块太多，只保留前90个并添加提示
      blocks.splice(90);
      blocks.push({
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{ 
            type: 'text', 
            text: { content: '⚠️ 内容过多，部分镜头信息已省略。请在应用内查看完整版本。' } 
          }],
          icon: { emoji: '⚠️' },
        },
      });
    }

    return blocks;
  }

  private async addShotToDatabase(shot: Shot, storyboardTitle: string): Promise<void> {
    try {
      await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          'Shot Number': {
            number: shot.shotNumber,
          },
          'Storyboard': {
            rich_text: [
              {
                text: {
                  content: storyboardTitle,
                },
              },
            ],
          },
          'Duration': {
            number: shot.duration,
          },
          'Shot Type': {
            select: {
              name: shot.shotType,
            },
          },
          'Description': {
            rich_text: [
              {
                text: {
                  content: shot.visualDescription,
                },
              },
            ],
          },
          'Dialogue': {
            rich_text: [
              {
                text: {
                  content: shot.dialogue || '',
                },
              },
            ],
          },
          'Marketing Point': {
            rich_text: [
              {
                text: {
                  content: shot.marketingPoint,
                },
              },
            ],
          },
        },
      });
    } catch (error) {
      console.error('Error adding shot to database:', error);
    }
  }

  async createDatabase(): Promise<string> {
    const response = await this.notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: process.env.NOTION_PAGE_ID || '',
      },
      title: [
        {
          type: 'text',
          text: {
            content: '分镜脚本数据库',
          },
        },
      ],
      properties: {
        'Title': {
          title: {},
        },
        'Script': {
          rich_text: {},
        },
        'Total Duration': {
          number: {
            format: 'number',
          },
        },
        'Created Date': {
          date: {},
        },
        'Viral Strategy': {
          rich_text: {},
        },
        'Shot Number': {
          number: {
            format: 'number',
          },
        },
        'Storyboard': {
          rich_text: {},
        },
        'Duration': {
          number: {
            format: 'number',
          },
        },
        'Shot Type': {
          select: {
            options: [
              { name: '特写', color: 'red' },
              { name: '近景', color: 'orange' },
              { name: '中景', color: 'yellow' },
              { name: '全景', color: 'green' },
              { name: '远景', color: 'blue' },
            ],
          },
        },
        'Description': {
          rich_text: {},
        },
        'Dialogue': {
          rich_text: {},
        },
        'Marketing Point': {
          rich_text: {},
        },
      },
    });

    return response.id;
  }
}
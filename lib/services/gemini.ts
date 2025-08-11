import { GoogleGenerativeAI } from '@google/generative-ai';
import { Shot, Storyboard, GenerateRequest } from '../types';

export class GeminiService {
  private model;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }

  async generateStoryboard(request: GenerateRequest): Promise<Storyboard> {
    const prompt = this.buildPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text, request.script);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate storyboard');
    }
  }

  private buildPrompt(request: GenerateRequest): string {
    return `你是一位专业的短视频分镜脚本专家，精通病毒营销策略。

重要说明：用户提供的文案就是视频的旁白内容，你需要：
1. 按照标点符号（句号、问号、感叹号、逗号）切分文案
2. 每个短句对应一个独立镜头（符合短视频快节奏风格）
3. 不要改写或重新创作旁白内容，必须使用原文

用户提供的旁白文案：
${request.script}

要求：
1. 风格：${request.style}
2. 目标时长：${request.targetDuration}秒
3. 投放平台：${request.platform}
4. 目标受众：${request.targetAudience}

分镜原则：
1. 一个短句 = 一个镜头（每个标点符号前的内容作为一个镜头）
2. 每个镜头时长控制在1-3秒（快节奏）
3. 镜头切换要有节奏感和视觉冲击力
4. 保持原文案的完整性，不要遗漏任何文字

任务：
1. 将旁白按标点符号切分成多个镜头
2. 每个镜头的旁白就是对应的短句
3. 为每个短句设计匹配的视觉画面
4. 确保镜头节奏快速、紧凑

病毒营销策略要点：
- 前3秒必须有强视觉冲击或悬念
- 设置至少3个情绪高潮点
- 包含引导互动的元素（提问、争议点等）
- 创造独特的视觉记忆点
- 节奏要快慢结合，符合平台特性

请以JSON格式返回，包含以下结构：
{
  "shots": [
    {
      "shotNumber": 1,
      "duration": 2,
      "shotType": "特写/近景/中景/全景/远景",
      "visualDescription": "详细的画面描述",
      "dialogue": "台词内容（如果有）",
      "narration": "这个镜头的旁白（原文案中的一个短句，以标点符号为界）",
      "cameraMovement": "摄像机运动（推拉摇移跟等）",
      "lightingNotes": "灯光要点",
      "marketingPoint": "营销策略点",
      "emotionCurve": "high/medium/low"
    }
  ],
  "viralStrategy": {
    "openingHook": "开场钩子描述",
    "emotionalPeaks": ["情绪高潮点1", "情绪高潮点2"],
    "interactionPoints": ["互动点1", "互动点2"],
    "visualMemoryPoints": ["视觉记忆点1", "视觉记忆点2"]
  }
}

注意：
1. 每个镜头的描述要具体可执行
2. 考虑实际拍摄的可行性
3. 符合${request.platform}平台的内容特点
4. 时长控制在${request.targetDuration}秒左右
5. 重要：每个标点符号前的内容都应该是一个独立镜头
6. 重要：旁白必须是原文案的内容，不要改写
7. 重要：镜头数量应该等于文案中句子/短语的数量`;
  }

  private parseResponse(text: string, originalScript: string): Storyboard {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shots: Shot[] = parsed.shots.map((shot: any, index: number) => ({
        id: `shot-${Date.now()}-${index}`,
        shotNumber: shot.shotNumber || index + 1,
        duration: shot.duration || 3,
        shotType: shot.shotType || '中景',
        visualDescription: shot.visualDescription || '',
        dialogue: shot.dialogue || '',
        narration: shot.narration || '',
        cameraMovement: shot.cameraMovement || '固定',
        lightingNotes: shot.lightingNotes || '自然光',
        marketingPoint: shot.marketingPoint || '',
        emotionCurve: shot.emotionCurve || 'medium'
      }));

      const totalDuration = shots.reduce((sum, shot) => sum + shot.duration, 0);

      return {
        id: `storyboard-${Date.now()}`,
        title: originalScript.substring(0, 50),
        script: originalScript,
        totalDuration,
        shots,
        viralStrategy: {
          openingHook: parsed.viralStrategy?.openingHook || '',
          emotionalPeaks: parsed.viralStrategy?.emotionalPeaks || [],
          interactionPoints: parsed.viralStrategy?.interactionPoints || [],
          visualMemoryPoints: parsed.viralStrategy?.visualMemoryPoints || []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('Failed to parse storyboard data');
    }
  }
}
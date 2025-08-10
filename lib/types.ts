export interface Shot {
  id: string;
  shotNumber: number;
  duration: number;
  shotType: '特写' | '近景' | '中景' | '全景' | '远景';
  visualDescription: string;
  dialogue: string;
  narration: string;
  cameraMovement: string;
  lightingNotes: string;
  marketingPoint: string;
  emotionCurve: 'high' | 'medium' | 'low';
}

export interface Storyboard {
  id: string;
  title: string;
  script: string;
  totalDuration: number;
  shots: Shot[];
  viralStrategy: {
    openingHook: string;
    emotionalPeaks: string[];
    interactionPoints: string[];
    visualMemoryPoints: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateRequest {
  script: string;
  style: 'dramatic' | 'comedy' | 'documentary' | 'commercial' | 'educational';
  targetDuration: number;
  platform: 'douyin' | 'xiaohongshu' | 'youtube' | 'bilibili';
  targetAudience: string;
}
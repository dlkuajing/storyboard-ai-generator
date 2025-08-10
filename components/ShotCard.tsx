'use client';

import { Shot } from '@/lib/types';
import { Clock, Camera, Mic, Lightbulb, TrendingUp } from 'lucide-react';

interface ShotCardProps {
  shot: Shot;
  index: number;
}

export default function ShotCard({ shot, index }: ShotCardProps) {
  const emotionColors = {
    high: 'bg-red-100 border-red-500',
    medium: 'bg-yellow-100 border-yellow-500',
    low: 'bg-blue-100 border-blue-500',
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${emotionColors[shot.emotionCurve]} transition-all hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">#{shot.shotNumber}</span>
          <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">
            {shot.shotType}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{shot.duration}秒</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            画面描述
          </h4>
          <p className="text-gray-600 leading-relaxed">{shot.visualDescription}</p>
        </div>

        {shot.dialogue && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              台词
            </h4>
            <p className="text-gray-600 italic">"{shot.dialogue}"</p>
          </div>
        )}

        {shot.narration && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">旁白</h4>
            <p className="text-gray-600 italic">{shot.narration}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">摄像机运动:</span>
            <span className="ml-2 font-medium">{shot.cameraMovement}</span>
          </div>
          <div>
            <span className="text-gray-500">灯光:</span>
            <span className="ml-2 font-medium">{shot.lightingNotes}</span>
          </div>
        </div>

        {shot.marketingPoint && (
          <div className="bg-white bg-opacity-70 rounded-lg p-3">
            <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              营销策略点
            </h4>
            <p className="text-sm text-gray-600">{shot.marketingPoint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { Storyboard } from '@/lib/types';
import { Zap, Heart, MessageCircle, Eye } from 'lucide-react';

interface ViralStrategyProps {
  strategy: Storyboard['viralStrategy'];
}

export default function ViralStrategy({ strategy }: ViralStrategyProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">病毒营销策略分析</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold text-gray-700">开场钩子</h4>
          </div>
          <p className="text-gray-600 bg-white rounded-lg p-3">
            {strategy.openingHook || '未设置开场钩子'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h4 className="font-semibold text-gray-700">情绪高潮点</h4>
          </div>
          <ul className="space-y-2">
            {strategy.emotionalPeaks?.map((peak, index) => (
              <li key={index} className="text-gray-600 bg-white rounded-lg p-2 text-sm">
                • {peak}
              </li>
            )) || <li className="text-gray-400">暂无情绪高潮点</li>}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold text-gray-700">互动诱导点</h4>
          </div>
          <ul className="space-y-2">
            {strategy.interactionPoints?.map((point, index) => (
              <li key={index} className="text-gray-600 bg-white rounded-lg p-2 text-sm">
                • {point}
              </li>
            )) || <li className="text-gray-400">暂无互动点</li>}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-green-500" />
            <h4 className="font-semibold text-gray-700">视觉记忆点</h4>
          </div>
          <ul className="space-y-2">
            {strategy.visualMemoryPoints?.map((point, index) => (
              <li key={index} className="text-gray-600 bg-white rounded-lg p-2 text-sm">
                • {point}
              </li>
            )) || <li className="text-gray-400">暂无视觉记忆点</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
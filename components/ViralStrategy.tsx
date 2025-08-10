'use client';

import { memo } from 'react';
import { Storyboard } from '@/lib/types';
import { 
  Zap, Heart, MessageCircle, Eye, 
  TrendingUp, Target, Sparkles, Share2 
} from 'lucide-react';

interface ViralStrategyProps {
  strategy: Storyboard['viralStrategy'];
}

const ViralStrategy = memo(function ViralStrategy({ strategy }: ViralStrategyProps) {
  const strategies = [
    {
      icon: Zap,
      title: '开场钩子',
      content: strategy.openingHook,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'from-yellow-50 to-orange-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      delay: '0ms',
    },
    {
      icon: Heart,
      title: '情绪高潮点',
      content: strategy.emotionalPeaks,
      color: 'from-red-400 to-pink-400',
      bgColor: 'from-red-50 to-pink-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      delay: '100ms',
      isList: true,
    },
    {
      icon: MessageCircle,
      title: '互动诱导点',
      content: strategy.interactionPoints,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      delay: '200ms',
      isList: true,
    },
    {
      icon: Eye,
      title: '视觉记忆点',
      content: strategy.visualMemoryPoints,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      delay: '300ms',
      isList: true,
    },
  ];

  return (
    <div className="relative mt-8">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-transparent to-pink-100/50 rounded-2xl blur-2xl" />
      
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 overflow-hidden">
        {/* 标题部分 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                病毒营销策略分析
              </h3>
              <p className="text-sm text-gray-500 mt-1">基于AI深度分析的传播策略</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">精准投放</span>
          </div>
        </div>
        
        {/* 策略卡片网格 */}
        <div className="grid md:grid-cols-2 gap-6">
          {strategies.map((item, index) => {
            const Icon = item.icon;
            const hasContent = item.isList 
              ? item.content && Array.isArray(item.content) && item.content.length > 0
              : item.content;
            
            return (
              <div
                key={item.title}
                className="group relative animate-fade-in-scale"
                style={{ animationDelay: item.delay }}
              >
                {/* 卡片背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* 图标和标题 */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`${item.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                      <div className={`h-0.5 w-16 bg-gradient-to-r ${item.color} rounded-full mt-2`} />
                    </div>
                  </div>
                  
                  {/* 内容 */}
                  <div className="space-y-2">
                    {hasContent ? (
                      item.isList ? (
                        <ul className="space-y-2">
                          {(item.content as string[]).map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 group/item">
                              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color} mt-2 group-hover/item:scale-150 transition-transform`} />
                              <span className="text-gray-700 text-sm leading-relaxed flex-1">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {item.content as string}
                        </p>
                      )
                    ) : (
                      <p className="text-gray-400 italic text-sm">
                        暂无{item.title.replace('点', '')}设置
                      </p>
                    )}
                  </div>
                  
                  {/* 装饰性元素 */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-full`} />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 底部提示 */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-purple-700">传播建议：</span>
              根据以上策略点优化内容，提升视频的病毒传播潜力
            </p>
          </div>
        </div>
        
        {/* 背景装饰点 */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-float" />
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
});

export default ViralStrategy;
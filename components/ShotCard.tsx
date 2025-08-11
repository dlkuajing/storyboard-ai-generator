'use client';

import { useState, memo } from 'react';
import { Shot } from '@/lib/types';
import { 
  Clock, Camera, Mic, Lightbulb, TrendingUp, 
  ChevronDown, ChevronUp, Copy, Check, Maximize2,
  Palette, Video, Volume2, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ShotCardProps {
  shot: Shot;
  index: number;
}

const ShotCard = memo(function ShotCard({ shot, index }: ShotCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const emotionStyles = {
    high: {
      border: 'border-red-400',
      bg: 'bg-gradient-to-br from-red-50 to-orange-50',
      badge: 'bg-red-100 text-red-700 border-red-200',
      icon: 'text-red-500',
      glow: 'shadow-red-100',
    },
    medium: {
      border: 'border-yellow-400',
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: 'text-yellow-500',
      glow: 'shadow-yellow-100',
    },
    low: {
      border: 'border-blue-400',
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: 'text-blue-500',
      glow: 'shadow-blue-100',
    },
  };

  const style = emotionStyles[shot.emotionCurve];
  
  const shotTypeIcons = {
    '特写': '🎯',
    '近景': '👤',
    '中景': '🚶',
    '全景': '🏞️',
    '远景': '🌄',
  };

  const handleCopy = async () => {
    const content = `
镜头 #${shot.shotNumber} - ${shot.shotType}
时长: ${shot.duration}秒
画面: ${shot.visualDescription}
${shot.dialogue ? `台词: ${shot.dialogue}` : ''}
${shot.narration ? `旁白: ${shot.narration}` : ''}
摄像机: ${shot.cameraMovement}
灯光: ${shot.lightingNotes}
${shot.marketingPoint ? `营销点: ${shot.marketingPoint}` : ''}
    `.trim();
    
    await navigator.clipboard.writeText(content);
    setIsCopied(true);
    toast.success('已复制到剪贴板');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-500 
        ${style.border} ${style.bg} 
        hover:shadow-2xl hover:-translate-y-1 card-hover
        ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}
        animate-fade-in-scale
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
      <div className={`absolute bottom-0 left-0 w-24 h-24 ${style.glow} blur-3xl opacity-30`} />
      
      {/* 头部信息 */}
      <div className="relative p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-3xl font-bold bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent">
                #{shot.shotNumber}
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50" />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">{shotTypeIcons[shot.shotType]}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${style.badge}`}>
                {shot.shotType}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur rounded-lg ${style.icon}`}>
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-sm">{shot.duration}秒</span>
            </div>
            
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/80 backdrop-blur hover:bg-white transition-colors"
              title="复制镜头信息"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* 主要内容 */}
        <div className="space-y-4">
          {/* 画面描述 - 始终显示 */}
          <div className="bg-white/60 backdrop-blur rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Camera className={`w-5 h-5 ${style.icon}`} />
              画面描述
            </h4>
            <p className="text-gray-700 leading-relaxed">{shot.visualDescription}</p>
          </div>
          
          {/* 台词和旁白 - 始终显示（如果有） */}
          {(shot.dialogue || shot.narration) && (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {shot.dialogue && (
                <div className="bg-white/60 backdrop-blur rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mic className={`w-5 h-5 ${style.icon}`} />
                    台词
                  </h4>
                  <p className="text-gray-700 italic">&ldquo;{shot.dialogue}&rdquo;</p>
                </div>
              )}
              
              {shot.narration && (
                <div className="bg-white/60 backdrop-blur rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Volume2 className={`w-5 h-5 ${style.icon}`} />
                    旁白
                  </h4>
                  <p className="text-gray-700 italic">{shot.narration}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 展开/收起按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 bg-white/40 backdrop-blur border-t border-white/20 hover:bg-white/60 transition-all flex items-center justify-center gap-2 group"
      >
        <span className="text-sm font-medium text-gray-700">
          {isExpanded ? '收起详情' : '查看详情'}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 group-hover:-translate-y-0.5 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 group-hover:translate-y-0.5 transition-transform" />
        )}
      </button>
      
      {/* 展开内容 */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-96' : 'max-h-0'}
      `}>
        <div className="p-6 pt-0 space-y-4">
          {/* 技术参数 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/60 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Video className={`w-4 h-4 ${style.icon}`} />
                <span className="text-sm font-medium text-gray-600">摄像机运动</span>
              </div>
              <p className="text-gray-700 font-medium">{shot.cameraMovement}</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette className={`w-4 h-4 ${style.icon}`} />
                <span className="text-sm font-medium text-gray-600">灯光设置</span>
              </div>
              <p className="text-gray-700 font-medium">{shot.lightingNotes}</p>
            </div>
          </div>
          
          {/* 营销策略点 */}
          {shot.marketingPoint && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                营销策略点
              </h4>
              <p className="text-gray-700">{shot.marketingPoint}</p>
            </div>
          )}
          
          {/* 情绪强度指示器 */}
          <div className="bg-white/60 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Zap className={`w-4 h-4 ${style.icon}`} />
                情绪强度
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                {shot.emotionCurve === 'high' ? '高潮' : shot.emotionCurve === 'medium' ? '中等' : '平缓'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out
                  ${shot.emotionCurve === 'high' 
                    ? 'from-red-400 to-orange-400 w-full' 
                    : shot.emotionCurve === 'medium' 
                      ? 'from-yellow-400 to-amber-400 w-2/3' 
                      : 'from-blue-400 to-cyan-400 w-1/3'}`}
                style={{ animation: isExpanded ? 'slideInRight 0.5s ease-out' : 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShotCard;
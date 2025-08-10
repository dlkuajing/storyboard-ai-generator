'use client';

import { Film, Sparkles, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  title = '开始创作你的分镜脚本',
  description = '输入文案内容，AI将为你生成专业的分镜脚本',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-pink-50 opacity-50" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" 
        style={{ animationDelay: '1s' }} />
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
          {icon || (
            <div className="relative">
              <Film className="w-12 h-12 text-purple-600" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3 animate-fade-in">
          {title}
        </h3>
        
        <p className="text-gray-600 max-w-md mx-auto mb-8 animate-fade-in" 
          style={{ animationDelay: '100ms' }}>
          {description}
        </p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg animate-fade-in-scale"
            style={{ animationDelay: '200ms' }}
          >
            {action.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        
        {/* 装饰元素 */}
        <div className="absolute top-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-float" />
        <div className="absolute top-12 right-12 w-3 h-3 bg-pink-400 rounded-full animate-float" 
          style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-8 right-8 w-2 h-2 bg-yellow-400 rounded-full animate-float" 
          style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
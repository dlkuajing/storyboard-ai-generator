'use client';

import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  className = '',
}: ProgressIndicatorProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* 进度条背景 */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        
        {/* 进度条进度 */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        
        {/* 步骤点 */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;
            
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center"
              >
                {/* 圆点 */}
                <div className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  transition-all duration-300 transform
                  ${isCompleted 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 scale-100' 
                    : isCurrent 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 scale-110 animate-pulse' 
                      : 'bg-gray-200 scale-100'
                  }
                  ${isCurrent ? 'shadow-lg shadow-purple-500/30' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white animate-fade-in" />
                  ) : isCurrent ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                  
                  {/* 当前步骤的光晕效果 */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 animate-ping opacity-30" />
                  )}
                </div>
                
                {/* 标签 */}
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent 
                      ? 'text-gray-800' 
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.description && isCurrent && (
                    <p className="mt-1 text-xs text-gray-500 animate-fade-in max-w-[100px]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
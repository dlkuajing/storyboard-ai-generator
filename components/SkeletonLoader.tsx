'use client';

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'title' | 'button' | 'image';
  className?: string;
  count?: number;
}

export default function SkeletonLoader({ 
  type = 'text', 
  className = '',
  count = 1 
}: SkeletonLoaderProps) {
  const baseClass = 'skeleton';
  
  const typeClasses = {
    card: 'h-48 w-full rounded-xl',
    text: 'h-4 w-full rounded',
    title: 'h-8 w-3/4 rounded',
    button: 'h-10 w-32 rounded-lg',
    image: 'h-64 w-full rounded-xl',
  };
  
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`${baseClass} ${typeClasses.card} ${className}`}>
            <div className="p-6 space-y-4">
              <div className="skeleton h-6 w-1/3 rounded" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/6 rounded" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="skeleton h-8 w-20 rounded-lg" />
                <div className="skeleton h-8 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`${baseClass} ${typeClasses[type]} ${className}`} />
        );
    }
  };
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-3' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
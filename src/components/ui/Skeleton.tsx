interface SkeletonProps {
  variant?: 'text-line' | 'stat-card' | 'table-row' | 'chart';
  className?: string;
}

export function Skeleton({ variant = 'text-line', className = '' }: SkeletonProps) {
  const baseStyle = 'animate-pulse bg-gradient-to-r from-elevated to-surface';
  
  const variants = {
    'text-line': 'h-3 w-full rounded',
    'stat-card': 'h-20 w-full rounded',
    'table-row': 'h-12 w-full rounded',
    'chart': 'h-64 w-full rounded',
  };

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}

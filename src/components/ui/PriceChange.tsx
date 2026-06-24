import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceChangeProps {
  value: number;
  size?: 'sm' | 'md';
}

export function PriceChange({ value, size = 'sm' }: PriceChangeProps) {
  const isPositive = value > 0.1;
  const isNegative = value < -0.1;

  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-mono tabular-nums ${
        isPositive
          ? 'text-positive bg-positive/10'
          : isNegative
          ? 'text-rose-bright bg-rose-ghost'
          : 'text-muted bg-elevated'
      } ${sizeStyles[size]}`}
      style={{ borderRadius: '2px' }}
    >
      {isPositive ? (
        <TrendingUp className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      ) : isNegative ? (
        <TrendingDown className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      ) : (
        <Minus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      )}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

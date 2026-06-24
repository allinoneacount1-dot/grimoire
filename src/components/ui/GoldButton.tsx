import { Loader2 } from 'lucide-react';

interface GoldButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function GoldButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
}: GoldButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 hover:-translate-y-px active:translate-y-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0';
  
  const variantStyles = {
    primary: 'bg-gold-bright text-void hover:bg-gold-dim',
    secondary: 'bg-transparent border border-gold-bright text-gold-bright hover:bg-gold-ghost',
    ghost: 'bg-transparent text-muted hover:text-gold-bright',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-sm gap-2',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{ borderRadius: '2px' }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

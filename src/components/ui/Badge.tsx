import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md';
}

export default function Badge({ className, variant = 'primary', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-[rgba(12,191,184,0.1)] text-[var(--primary)] border border-[rgba(12,191,184,0.2)]',
    secondary: 'bg-[var(--surface-container)] text-[var(--on-surface-variant)] border border-[var(--outline-variant)]',
    outline: 'bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] text-[var(--on-surface-variant)]',
    success: 'bg-[var(--green-bg)] text-[var(--green)] border border-[rgba(22,163,74,0.2)]',
    warning: 'bg-[var(--amber-bg)] text-[var(--amber)] border border-[rgba(217,119,6,0.2)]',
    danger: 'bg-red-50 text-red-700 border border-red-100',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.15em] rounded',
    sm: 'px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md',
    md: 'px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg',
  };

  return (
    <div className={cn('inline-flex items-center justify-center font-black transition-all', variants[variant], sizes[size], className)} {...props}>
      {children}
    </div>
  );
}

import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'flat' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Card({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-[var(--surface-container-lowest)] border border-[rgba(187,202,199,0.15)] shadow-sm',
    outline: 'bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]',
    flat: 'bg-[var(--surface-container-low)] border border-[rgba(187,202,199,0.10)]',
    dark: 'bg-[#063D3A] border border-[rgba(12,191,184,0.15)] text-white shadow-xl',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      className={cn('rounded-2xl transition-all', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}

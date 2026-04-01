'use client';

import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export default function Button({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:brightness-110 shadow-sm active:scale-[0.98]',
    secondary: 'bg-[var(--on-surface)] text-white hover:brightness-110 shadow-sm active:scale-[0.98]',
    outline: 'bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] text-[var(--on-surface-variant)] hover:bg-[var(--teal-light)] hover:text-[var(--primary)] hover:border-[var(--primary-container)]',
    ghost: 'bg-transparent text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]',
    danger: 'bg-[var(--error)] text-white hover:brightness-110 shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] rounded-md',
    sm: 'px-3 py-2 text-xs font-bold rounded-lg',
    md: 'px-4 py-2.5 text-sm font-bold rounded-xl',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl',
    xl: 'px-8 py-4 text-lg font-black rounded-3xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </div>
      ) : children}
    </button>
  );
}

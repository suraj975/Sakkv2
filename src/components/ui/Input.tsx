import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export default function Input({ className, label, error, icon, ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-black text-[var(--on-surface-variant)] uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--outline)] group-focus-within:text-[var(--primary-container)] transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 bg-[var(--surface-container-low)] border border-transparent rounded-xl text-sm font-medium text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[rgba(12,191,184,0.2)] focus:border-[var(--primary)] transition-all placeholder:text-[var(--outline)]',
            icon && 'pl-10',
            error && 'border-[var(--error)] focus:ring-[rgba(186,26,26,0.1)]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-[var(--error)] ml-1">{error}</p>}
    </div>
  );
}

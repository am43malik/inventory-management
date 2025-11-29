'use client';

import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const badgeVariants: Record<string, string> = {
  default: 'inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground hover:bg-primary/80 transition-colors',
  secondary: 'inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors',
  destructive: 'inline-flex items-center rounded-full border border-transparent bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/80 transition-colors',
  outline: 'inline-flex items-center rounded-full border border-input px-2.5 py-0.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors',
  success: 'inline-flex items-center rounded-full border border-transparent bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 transition-colors',
  warning: 'inline-flex items-center rounded-full border border-transparent bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors',
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={`${badgeVariants[variant]} ${className}`}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

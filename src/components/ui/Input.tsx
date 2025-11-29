'use client';

import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', type, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-destructive focus-visible:ring-destructive' : ''
        } ${className}`}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm font-medium text-destructive mt-1">{error}</p>
      )}
    </div>
  )
);
Input.displayName = 'Input';

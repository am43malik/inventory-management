'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'destructive' | 'warning' | 'info';
  onClose?: () => void;
}

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-50',
  destructive: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-50',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-50',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-50',
};

const iconMap = {
  success: CheckCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', type = 'info', onClose, children, ...props }, ref) => {
    const Icon = iconMap[type];

    return (
      <div
        ref={ref}
        className={`relative w-full rounded-lg border p-4 ${typeStyles[type]} ${className}`}
        role="alert"
        {...props}
      >
        <div className="flex gap-3">
          <Icon className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">{children}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex h-5 w-5 items-center justify-center rounded-md opacity-50 hover:opacity-100 transition-opacity shrink-0"
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = '', ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-tight ${className}`}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

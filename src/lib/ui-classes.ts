/**
 * Tailwind CSS class utility functions for shadcn/ui styling
 * These provide consistent theming across the application
 */

export const containerClasses = {
  // Layout containers
  base: 'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
  page: 'space-y-6',
  section: 'space-y-4',
  
  // Grid systems
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
};

export const textClasses = {
  // Headings
  h1: 'text-4xl font-bold tracking-tight text-foreground',
  h2: 'text-3xl font-semibold tracking-tight text-foreground',
  h3: 'text-2xl font-semibold tracking-tight text-foreground',
  h4: 'text-xl font-semibold text-foreground',
  h5: 'text-lg font-semibold text-foreground',
  
  // Body text
  body: 'text-base text-foreground',
  small: 'text-sm text-foreground',
  muted: 'text-sm text-muted-foreground',
  
  // Special
  code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
};

export const formClasses = {
  // Form groups
  group: 'space-y-2',
  
  // Common patterns
  twoColumn: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  threeColumn: 'grid grid-cols-1 md:grid-cols-3 gap-6',
};

export const statusClasses = {
  // Status indicators
  success: 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50',
  destructive: 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50',
  warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-50',
  info: 'bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50',
};

export const badgeClasses = {
  // Badge variants
  default: 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary text-primary-foreground',
  secondary: 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground',
  destructive: 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-destructive text-destructive-foreground',
  outline: 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-primary text-primary',
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

# 🎨 shadcn/ui Quick Reference

## Component Quick Start

### Buttons
```tsx
import { Button } from '@/components/ui/Button';

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>
```

### Cards
```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardContent, 
  CardFooter 
} from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Forms
```tsx
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

<Input 
  label="Name"
  placeholder="Enter name"
  error="This field is required"
/>

<Select 
  label="Category"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
/>
```

### Alerts
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';

<Alert type="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed</AlertDescription>
</Alert>

<Alert type="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>

<Alert type="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please verify</AlertDescription>
</Alert>

<Alert type="info">
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>For your information</AlertDescription>
</Alert>
```

### Tables
```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/Table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header 1</TableHead>
      <TableHead>Header 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell 1</TableCell>
      <TableCell>Cell 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Badges
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Danger</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
```

### Skeleton
```tsx
import { Skeleton } from '@/components/ui/Skeleton';

<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

### Theme Toggle
```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

<ThemeToggle />
```

## Layout Patterns

### Page Layout
```tsx
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function MyPage() {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Page Title</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Section</CardTitle>
          </CardHeader>
          <CardContent>Content here</CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Column 1</Card>
  <Card>Column 2</Card>
  <Card>Column 3</Card>
</div>
```

### Form Layout
```tsx
<Card>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <Input label="Field 1" />
      <Input label="Field 2" />
      <Select label="Choose" options={[...]} />
      <Button type="submit">Submit</Button>
    </form>
  </CardContent>
</Card>
```

## Color Classes

### Text Colors
```tsx
<div className="text-foreground">Default text</div>
<div className="text-primary">Primary text</div>
<div className="text-secondary">Secondary text</div>
<div className="text-muted-foreground">Muted text</div>
<div className="text-destructive">Destructive text</div>
```

### Background Colors
```tsx
<div className="bg-background">Default background</div>
<div className="bg-card">Card background</div>
<div className="bg-muted">Muted background</div>
<div className="bg-primary text-primary-foreground">Primary bg</div>
<div className="bg-secondary text-secondary-foreground">Secondary bg</div>
```

### Border Colors
```tsx
<div className="border border-border">Default border</div>
<div className="border border-primary">Primary border</div>
<div className="border-2 border-destructive">Error border</div>
```

## Common Patterns

### Loading State
```tsx
const [isLoading, setIsLoading] = useState(false);

<Button isLoading={isLoading}>
  Submit
</Button>
```

### Error Handling
```tsx
const [error, setError] = useState('');

{error && (
  <Alert type="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

### Success Message
```tsx
{message && (
  <Alert type="success" onClose={() => setMessage('')}>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)}
```

### Data Table with Actions
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Button size="sm" onClick={() => handleEdit(item)}>
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Card with Stat
```tsx
<Card>
  <CardContent className="pt-6">
    <div className="text-center space-y-2">
      <p className="text-muted-foreground">Total Items</p>
      <p className="text-4xl font-bold">1,234</p>
      <p className="text-xs text-green-600">↑ 12% from last month</p>
    </div>
  </CardContent>
</Card>
```

## Theme Customization

### Add Custom Color
1. Edit `src/app/globals.css`:
```css
:root {
  --custom: 280 85% 50%;
}

.dark {
  --custom: 280 85% 40%;
}
```

2. Update `tailwind.config.ts`:
```ts
colors: {
  custom: 'hsl(var(--custom))',
}
```

3. Use in components:
```tsx
<div className="bg-custom text-white">Custom Color</div>
```

### Switch Theme Programmatically
```tsx
'use client';

import { useTheme } from 'next-themes';

export function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  );
}
```

## Spacing Utilities

```tsx
// Space between elements
<div className="space-y-4">Item 1</div>
<div className="space-y-4">Item 2</div>

// Padding
<div className="p-4">Padding all sides</div>
<div className="px-4 py-2">Horizontal and vertical</div>

// Margin
<div className="mb-4">Margin bottom</div>
<div className="mt-2 ml-4">Margin top and left</div>

// Gap (in grid/flex)
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Responsive Classes

```tsx
// Hidden on mobile, visible on desktop
<div className="hidden md:block">Desktop only</div>

// Visible on mobile, hidden on desktop  
<div className="md:hidden">Mobile only</div>

// Grid columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Responsive grid</div>
</div>

// Font sizes
<h1 className="text-3xl md:text-4xl lg:text-5xl">Responsive heading</h1>
```

## Useful Links

- **Component Showcase**: `/theme-showcase`
- **shadcn/ui Docs**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Full Guide**: See `SHADCN_THEME_GUIDE.md`

---

💡 **Tip**: Use your browser's DevTools to inspect classes and colors in real-time!

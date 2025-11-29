# shadcn/ui Theme Implementation Guide

## Overview

Your inventory management application now uses **shadcn/ui** components with full support for:
- ✅ Light and Dark themes
- ✅ Multicolor support with CSS variables
- ✅ Consistent design system
- ✅ Accessible components
- ✅ Responsive layouts

## Theme Structure

### Color Variables

The theme uses CSS variables defined in `src/app/globals.css`:

```css
:root {
  --primary: 0 84.2% 60.2%;        /* Primary brand color (red) */
  --secondary: 217 91.2% 59.8%;    /* Secondary color (blue) */
  --accent: 142.1 70.6% 45.3%;     /* Accent color (green) */
  --destructive: 0 84.2% 60.2%;    /* Destructive action color (red) */
  --background: 0 0% 100%;         /* Page background */
  --foreground: 0 0% 3.6%;         /* Text color */
  --muted: 210 40% 96.1%;          /* Muted elements */
  --border: 214.3 31.8% 91.4%;     /* Border color */
}

.dark {
  --primary: 0 84.2% 60.2%;        /* Same primary in dark mode */
  --secondary: 217 91.2% 59.8%;    /* Same secondary in dark mode */
  --background: 0 0% 3.6%;         /* Dark background */
  --foreground: 0 0% 98%;          /* Light text */
  --muted: 217.2 32.6% 17.5%;      /* Darker muted */
  --border: 217.2 32.6% 17.5%;     /* Darker borders */
}
```

Colors use HSL format: `hue saturation lightness%`

## Components

### Updated Components

All UI components have been updated with shadcn/ui styling:

- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Input** - Enhanced with error states and labels
- **Select** - Styled dropdown with error handling
- **Card** - Base container with CardHeader, CardContent, CardFooter, CardTitle, CardDescription
- **Alert** - Four variants (success, destructive, warning, info) with icons
- **Table** - Semantic table components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)
- **Badge** - Status indicators with 6 variants
- **Skeleton** - Loading placeholders

### Theme Toggle

A theme toggle button is available in the Navbar:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// Use anywhere in your app
<ThemeToggle />
```

The toggle uses `next-themes` for automatic persistence and system preference detection.

## Usage Examples

### Button Variants

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Card Components

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
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Alert Component

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';

<Alert type="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully</AlertDescription>
</Alert>

<Alert type="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>
```

### Table Component

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
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Customizing Colors

To change theme colors, update `src/app/globals.css`:

```css
:root {
  /* Change primary color - use HSL values */
  --primary: 220 90% 56%;  /* Blue instead of red */
  --secondary: 340 82% 52%; /* Purple instead of blue */
  --accent: 40 96% 50%;    /* Orange instead of green */
}
```

## Class Utilities

Common utility classes are available in `src/lib/ui-classes.ts`:

```tsx
import { containerClasses, textClasses, statusClasses } from '@/lib/ui-classes';

<div className={containerClasses.base}>
  <h1 className={textClasses.h1}>Heading</h1>
  <p className={textClasses.muted}>Muted text</p>
</div>
```

## Navbar Integration

The updated Navbar includes:
- Theme toggle button
- Responsive design
- Enhanced styling with borders and transitions
- Dark/light mode support

```tsx
import { Navbar } from '@/components/Navbar';

// Automatically included in ProtectedLayout
```

## Theme Provider

All theme functionality is wrapped in `ThemeProvider` in the root layout. This handles:
- System preference detection
- localStorage persistence
- Class-based dark mode switching
- Hydration safety

## Files Modified/Created

- ✅ `src/app/globals.css` - Theme variables
- ✅ `src/app/layout.tsx` - Added ThemeProvider
- ✅ `tailwind.config.ts` - Color and spacing configuration
- ✅ `src/components/providers/ThemeProvider.tsx` - Theme setup
- ✅ `src/components/ThemeToggle.tsx` - Theme toggle button
- ✅ `src/components/ui/Card.tsx` - Updated Card component
- ✅ `src/components/ui/Button.tsx` - Updated Button component
- ✅ `src/components/ui/Input.tsx` - Updated Input component
- ✅ `src/components/ui/Select.tsx` - Updated Select component
- ✅ `src/components/ui/Alert.tsx` - Updated Alert component
- ✅ `src/components/ui/Table.tsx` - Updated Table component
- ✅ `src/components/ui/Badge.tsx` - New Badge component
- ✅ `src/components/ui/Skeleton.tsx` - New Skeleton component
- ✅ `src/components/Navbar.tsx` - Updated with theme support
- ✅ `src/components/ProtectedLayout.tsx` - Enhanced styling
- ✅ `src/lib/ui-classes.ts` - UI class utilities

## Best Practices

1. **Always use semantic color variables** instead of hardcoded colors
   ```tsx
   // ✅ Good
   <div className="bg-primary text-primary-foreground">
   
   // ❌ Avoid
   <div className="bg-red-600 text-white">
   ```

2. **Use the component API** instead of creating custom elements
   ```tsx
   // ✅ Good
   <Button variant="primary">Click me</Button>
   
   // ❌ Avoid
   <button className="bg-blue-600...">Click me</button>
   ```

3. **Test both light and dark modes** during development

4. **Use `cn()` utility for conditional classes**
   ```tsx
   import { cn } from '@/lib/ui-classes';
   
   <div className={cn("base-class", isActive && "active-class")}>
   ```

## Next Steps

To further enhance your app:

1. Install individual shadcn/ui components as needed:
   ```bash
   npx shadcn-ui@latest add dialog
   npx shadcn-ui@latest add dropdown-menu
   npx shadcn-ui@latest add form
   ```

2. Create custom components built on shadcn/ui:
   ```tsx
   import { Card, CardHeader, CardContent } from '@/components/ui/Card';
   import { Button } from '@/components/ui/Button';
   
   export function CustomComponent() {
     return (
       <Card>
         <CardHeader>Custom</CardHeader>
         <CardContent>Your content</CardContent>
       </Card>
     );
   }
   ```

3. Implement dashboard widgets using the themed components

## Support

For more information on shadcn/ui components, visit: https://ui.shadcn.com/

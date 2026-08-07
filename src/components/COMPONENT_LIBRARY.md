# RXSAAS Component Library

A comprehensive React component library built with TypeScript, Tailwind CSS, and design tokens for the RXSAAS Design System.

## Color Design Tokens

The following color tokens are available as CSS variables and can be used throughout the application:

### Primary Colors
- `--primary`: #8B5CF6 (Purple 500)
- `--success`: #22C55E
- `--warning`: #F59E0B
- `--error`: #EF4444
- `--info`: #3B82F6

### Neutral Colors
- `--rxsaas-background`: #F8FAFC (Light mode) / #0F172A (Dark mode)
- `--rxsaas-card`: #FFFFFF (Light mode) / #1E293B (Dark mode)
- `--rxsaas-border`: #E2E8F0 (Light mode) / #334155 (Dark mode)
- `--rxsaas-text-primary`: #1E293B (Light mode) / #F1F5F9 (Dark mode)
- `--rxsaas-text-secondary`: #64748B (Light mode) / #CBD5E1 (Dark mode)

### CSS Variables
All colors are available as CSS variables:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--border`, `--input`
- `--radius` (border radius)
- And more...

## UI Components

### Buttons
```tsx
import { Button } from "@/components/ui"

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>
<Button variant="error">Error</Button>
<Button variant="info">Info</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🎯</Button>
```

### Badges
```tsx
import { Badge } from "@/components/ui"

<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
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
} from "@/components/ui"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Forms & Inputs
```tsx
import { Input, FormField } from "@/components/ui"

// Basic Input
<Input type="text" placeholder="Enter text..." />

// Form Field with Label
<FormField
  label="Email"
  type="email"
  placeholder="your@email.com"
  required
  inputProps={{
    type: "email",
    placeholder: "your@email.com"
  }}
/>

// With Error
<FormField
  label="Password"
  error="Password is required"
  inputProps={{
    type: "password"
  }}
/>

// With Helper Text
<FormField
  label="Username"
  helperText="Must be at least 3 characters"
  inputProps={{
    minLength: 3
  }}
/>
```

### Selects
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Tables
```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header 1</TableHead>
      <TableHead>Header 2</TableHead>
      <TableHead>Header 3</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
      <TableCell>Data 3</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Modals
```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui"
import { Button } from "@/components/ui"

<Modal>
  <ModalTrigger>Open Modal</ModalTrigger>
  <ModalContent size="md" showCloseButton>
    <ModalHeader>
      <ModalTitle>Modal Title</ModalTitle>
      <ModalDescription>Modal description goes here</ModalDescription>
    </ModalHeader>
    <ModalBody>
      Modal content
    </ModalBody>
    <ModalFooter>
      <ModalClose render={<Button variant="outline">Cancel</Button>} />
      <Button variant="primary">Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

## Layout Components

### Sidebar
```tsx
import { Sidebar } from "@/components/layout"
import { HomeIcon, SettingsIcon } from "lucide-react"

<Sidebar
  items={[
    { href: "/", label: "Home", icon: <HomeIcon />, active: true },
    { href: "/settings", label: "Settings", icon: <SettingsIcon /> },
  ]}
  header={<div>Logo</div>}
  footer={<div>Footer Content</div>}
/>
```

### Navbar
```tsx
import { Navbar } from "@/components/layout"
import { BellIcon } from "lucide-react"

<Navbar
  title="Dashboard"
  subtitle="Welcome back"
  searchPlaceholder="Search..."
  onSearch={(value) => console.log(value)}
  actions={[
    { icon: <BellIcon />, label: "Notifications" }
  ]}
/>
```

### AppLayout
```tsx
import { AppLayout } from "@/components/layout"

<AppLayout
  navbarProps={{
    title: "Dashboard",
    subtitle: "Welcome"
  }}
  sidebarProps={{
    items: [
      { href: "/", label: "Home" }
    ]
  }}
  showSidebar={true}
>
  <div className="p-6">
    Your page content here
  </div>
</AppLayout>
```

## Design Tokens Usage

### In JavaScript/TypeScript
```tsx
import { designTokens } from "@/lib/tokens"

const primaryColor = designTokens.primary[500]
const successColor = designTokens.success
```

### In CSS/Tailwind
```jsx
<div className="bg-[var(--primary)] text-[var(--primary-foreground)]">
  Content
</div>
```

## Features

- ✅ **TypeScript**: Full TypeScript support with proper typing
- ✅ **Dark Mode Ready**: Light and dark mode variants for all components
- ✅ **Accessibility**: ARIA labels, semantic HTML, focus management
- ✅ **Responsive**: Mobile, tablet, and desktop responsive design
- ✅ **Design Tokens**: Centralized color and spacing tokens
- ✅ **Tailwind CSS**: Built with Tailwind CSS for easy customization
- ✅ **No Hardcoded Colors**: All colors use CSS variables and design tokens

## File Structure

```
src/components/
├── ui/
│   ├── button.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── form-field.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── modal.tsx
│   ├── sheet.tsx
│   ├── skeleton.tsx
│   ├── separator.tsx
│   ├── tooltip.tsx
│   └── index.ts
├── layout/
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   ├── AppLayout.tsx
│   └── index.ts
└── COMPONENT_LIBRARY.md

src/lib/
├── tokens.ts
└── utils.ts
```

## Import Examples

```tsx
// UI Components
import { Button, Card, Input, FormField, Modal } from "@/components/ui"

// Layout Components
import { Sidebar, Navbar, AppLayout } from "@/components/layout"

// Design Tokens
import { designTokens } from "@/lib/tokens"
```

## Customization

All components use CSS variables that can be customized in `src/app/globals.css`:

```css
:root {
  --primary: #8B5CF6;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new components:
1. Follow the naming conventions in this document
2. Use design tokens for all colors
3. Add TypeScript types
4. Include accessibility features (ARIA labels, semantic HTML)
5. Support both light and dark modes
6. Document the component in this file

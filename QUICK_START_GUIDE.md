# RXSAAS Component Library - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Import Components
```tsx
// UI Components
import { Button, Card, Input, FormField, Badge } from "@/components/ui"

// Layout Components  
import { AppLayout, Sidebar, Navbar } from "@/components/layout"

// Design Tokens
import { designTokens } from "@/lib/tokens"
```

### 2. Basic Button Example
```tsx
<Button variant="primary">Click Me</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Cancel</Button>
```

### 3. Form with Validation
```tsx
<FormField
  label="Email"
  required
  inputProps={{
    type: "email",
    placeholder: "your@email.com"
  }}
/>

<FormField
  label="Password"
  error="Password is too short"
  inputProps={{
    type: "password"
  }}
/>
```

### 4. Create a Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
    <CardDescription>This is a card component</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>
```

### 5. Build a Layout
```tsx
<AppLayout
  navbarProps={{
    title: "Dashboard",
    subtitle: "Welcome"
  }}
  sidebarProps={{
    items: [
      { href: "/", label: "Home", active: true },
      { href: "/users", label: "Users" }
    ]
  }}
>
  <div className="p-6">
    Your page content
  </div>
</AppLayout>
```

## Color Usage

### CSS Variables
```tsx
<div className="bg-[var(--primary)] text-[var(--primary-foreground)]">
  Primary Color
</div>

<div className="bg-[var(--success)] text-white">
  Success Color
</div>
```

### Badge with Colors
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>
```

## Component Variants Quick Reference

### Button Variants
- `primary` - Main action button
- `secondary` - Secondary action
- `success` - Positive action (green)
- `warning` - Warning action (amber)
- `danger` - Destructive action (red)
- `info` - Informational (blue)
- `outline` - Outlined style
- `ghost` - Minimal style
- `link` - Link style

### Button Sizes
- `xs` - Extra small
- `sm` - Small
- `default` - Default
- `lg` - Large
- `icon` - Icon button

### Badge Variants
Same as buttons: `primary`, `success`, `warning`, `error`, `info`, `outline`, `ghost`

### Modal Sizes
- `sm` - Small (max-width: 24rem)
- `md` - Medium (max-width: 28rem)
- `lg` - Large (max-width: 32rem)

## Common Patterns

### Form with Submit
```tsx
import { useState } from "react"
import { FormField, Button } from "@/components/ui"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form className="space-y-4">
      <FormField
        label="Email"
        required
        inputProps={{
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value)
        }}
      />
      <FormField
        label="Password"
        required
        inputProps={{
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value)
        }}
      />
      <Button variant="primary" className="w-full">Sign In</Button>
    </form>
  )
}
```

### Modal Dialog
```tsx
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose, Button } from "@/components/ui"

<Modal>
  <ModalTrigger>
    <Button>Open Dialog</Button>
  </ModalTrigger>
  <ModalContent size="md">
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
    </ModalHeader>
    <ModalBody>
      Are you sure you want to proceed?
    </ModalBody>
    <ModalFooter>
      <ModalClose>
        <Button variant="outline">Cancel</Button>
      </ModalClose>
      <Button variant="danger">Delete</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Data Table
```tsx
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Badge } from "@/components/ui"

const users = [
  { id: 1, name: "John", status: "active" },
  { id: 2, name: "Jane", status: "inactive" }
]

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <Badge variant={user.status === "active" ? "success" : "warning"}>
            {user.status}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Sidebar Navigation
```tsx
import { Sidebar, type SidebarNavItem } from "@/components/layout"
import { HomeIcon, SettingsIcon, UsersIcon } from "lucide-react"

const navItems: SidebarNavItem[] = [
  { href: "/", label: "Home", icon: <HomeIcon />, active: true },
  { href: "/users", label: "Users", icon: <UsersIcon /> },
  { href: "/settings", label: "Settings", icon: <SettingsIcon /> }
]

<Sidebar items={navItems} />
```

## Colors Reference

| Token | Light | Dark |
|-------|-------|------|
| `--primary` | #8B5CF6 | #8B5CF6 |
| `--success` | #22C55E | #22C55E |
| `--warning` | #F59E0B | #F59E0B |
| `--error` | #EF4444 | #EF4444 |
| `--info` | #3B82F6 | #3B82F6 |
| `--background` | #F8FAFC | #0F172A |
| `--foreground` | #1E293B | #F1F5F9 |

## Dark Mode

Components automatically support dark mode. To enable:

```html
<!-- Add 'dark' class to html or parent element -->
<html class="dark">
  <!-- Your content -->
</html>
```

## Documentation

- **Full Docs**: See `COMPONENT_LIBRARY.md` in `src/components/`
- **Examples**: See `COMPONENT_USAGE_EXAMPLES.tsx` in `src/components/`
- **Summary**: See `COMPONENT_LIBRARY_SUMMARY.md` in root directory

## Accessibility

All components include:
- ✓ ARIA labels and roles
- ✓ Keyboard navigation
- ✓ Focus management
- ✓ Screen reader support
- ✓ Semantic HTML

## TypeScript Support

Full TypeScript support:
```tsx
import { type SidebarNavItem, type NavbarProps, type AppLayoutProps } from "@/components/layout"

const items: SidebarNavItem[] = [
  { href: "/", label: "Home" }
]
```

## Tips & Best Practices

1. **Always use design tokens** - Use CSS variables, never hardcode colors
2. **Use variants** - Don't customize with className unless necessary
3. **Combine components** - Stack components for complex UIs
4. **Check accessibility** - Ensure ARIA labels are present
5. **Test dark mode** - Components look good in both themes
6. **Keep it simple** - Don't over-engineer component composition

## Getting Help

1. Check the documentation: `src/components/COMPONENT_LIBRARY.md`
2. Look at examples: `src/components/COMPONENT_USAGE_EXAMPLES.tsx`
3. Review token file: `src/lib/tokens.ts`
4. Check this guide: `QUICK_START_GUIDE.md`

## Next Steps

1. ✓ Import components into your page
2. ✓ Build UI with available variants
3. ✓ Use design tokens for colors
4. ✓ Test in light and dark mode
5. ✓ Check accessibility with screen readers

---

**Happy Building!** 🚀

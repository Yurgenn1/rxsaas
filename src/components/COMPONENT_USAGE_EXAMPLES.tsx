/**
 * RXSAAS Component Library - Usage Examples
 *
 * This file demonstrates how to use all the components in the RXSAAS
 * component library. Use these examples as reference when building pages.
 */

"use client"

import React, { useState } from "react"
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  FormField,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui"

import { AppLayout, type SidebarNavItem } from "@/components/layout"
import {
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  BarChartIcon,
  BellIcon,
} from "lucide-react"

/**
 * Example 1: Button Variants
 */
export function ButtonVariantsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Button Variants</CardTitle>
        <CardDescription>All available button styles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="info">Info</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Sizes:</p>
          <div className="flex flex-wrap gap-2">
            <Button size="xs" variant="primary">
              XS
            </Button>
            <Button size="sm" variant="primary">
              Small
            </Button>
            <Button size="default" variant="primary">
              Default
            </Button>
            <Button size="lg" variant="primary">
              Large
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Example 2: Badge Variants
 */
export function BadgeVariantsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Variants</CardTitle>
        <CardDescription>Status indicators and labels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Example 3: Form Fields
 */
export function FormFieldsExample() {
  const [email, setEmail] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Fields</CardTitle>
        <CardDescription>Input fields with labels and validation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          label="Email Address"
          required
          helperText="We'll never share your email"
          inputProps={{
            type: "email",
            placeholder: "your@email.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          }}
        />

        <FormField
          label="Password"
          required
          inputProps={{
            type: "password",
            placeholder: "Enter password",
          }}
        />

        <FormField
          label="Username"
          error="Username already taken"
          inputProps={{
            placeholder: "john_doe",
          }}
        />

        <FormField
          label="Disabled Field"
          disabled
          inputProps={{
            placeholder: "This field is disabled",
          }}
        />
      </CardContent>
    </Card>
  )
}

/**
 * Example 4: Select Component
 */
export function SelectExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Component</CardTitle>
        <CardDescription>Dropdown selection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  )
}

/**
 * Example 5: Table Component
 */
export function TableExample() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Example</CardTitle>
        <CardDescription>Data display in tabular format</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={row.status === "Active" ? "success" : "warning"}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/**
 * Example 6: Modal Component
 */
export function ModalExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modal Example</CardTitle>
        <CardDescription>Dialog windows</CardDescription>
      </CardHeader>
      <CardContent>
        <Modal>
          <ModalTrigger>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent size="md">
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>This is the modal content. You can put any content here.</p>
            </ModalBody>
            <ModalFooter>
              <ModalClose>
                <Button variant="outline">Cancel</Button>
              </ModalClose>
              <Button variant="primary">Confirm</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardContent>
    </Card>
  )
}

/**
 * Example 7: Complete App Layout
 */
export function AppLayoutExample() {
  const sidebarItems: SidebarNavItem[] = [
    { href: "/", label: "Dashboard", icon: <HomeIcon className="w-4 h-4" />, active: true },
    { href: "/users", label: "Users", icon: <UsersIcon className="w-4 h-4" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChartIcon className="w-4 h-4" /> },
    { href: "/settings", label: "Settings", icon: <SettingsIcon className="w-4 h-4" /> },
  ]

  return (
    <AppLayout
      showSidebar
      navbarProps={{
        title: "Dashboard",
        subtitle: "Welcome to RXSAAS",
        searchPlaceholder: "Search...",
        onSearch: (value) => console.log("Search:", value),
        actions: [
          {
            icon: <BellIcon className="w-4 h-4" />,
            label: "Notifications",
          },
        ],
      }}
      sidebarProps={{
        items: sidebarItems,
        header: <div className="text-lg font-bold">RXSAAS</div>,
        footer: <div className="text-xs text-muted-foreground">v1.0.0</div>,
      }}
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">$45,678</div>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">89%</div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>User Created</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>2 hours ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Order Completed</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>4 hours ago</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

/**
 * Example 8: Color Token Usage
 */
export function ColorTokensExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Tokens</CardTitle>
        <CardDescription>Using CSS variables for colors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Primary
          </div>
          <div
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: "var(--success)" }}
          >
            Success
          </div>
          <div
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: "var(--warning)" }}
          >
            Warning
          </div>
          <div
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: "var(--error)" }}
          >
            Error
          </div>
          <div
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: "var(--info)" }}
          >
            Info
          </div>
          <div
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: "var(--border)" }}
          >
            Border
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Main Examples Page
 */
export function ComponentsExamplesPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">RXSAAS Component Library</h1>
          <p className="text-muted-foreground">
            Complete examples of all available components
          </p>
        </div>

        <div className="grid gap-6">
          <ButtonVariantsExample />
          <BadgeVariantsExample />
          <FormFieldsExample />
          <SelectExample />
          <TableExample />
          <ModalExample />
          <ColorTokensExample />
        </div>
      </div>
    </div>
  )
}

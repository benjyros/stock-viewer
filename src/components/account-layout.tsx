"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { User, Settings, CreditCard, Bell, Shield, HelpCircle, Home } from "lucide-react"
import Link from "next/link"

export function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Overview", href: "/account" },
    { icon: User, label: "Profile", href: "/account/profile" },
    { icon: Settings, label: "Settings", href: "/account/settings" },
    { icon: CreditCard, label: "Billing", href: "/account/billing" },
    { icon: Bell, label: "Notifications", href: "/account/notifications" },
    { icon: Shield, label: "Security", href: "/account/security" },
    { icon: HelpCircle, label: "Help", href: "/account/help" },
  ]

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar className="top-16 h-[calc(100vh-4rem)]">
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Account</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-16 z-10 flex h-14 items-center border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <h1 className="ml-2 text-lg font-semibold">My Account</h1>
          </header>
          <main className="container mx-auto py-6 px-4 lg:px-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

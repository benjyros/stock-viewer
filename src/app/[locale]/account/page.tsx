import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { User, Settings, CreditCard, Bell, Shield, HelpCircle } from "lucide-react"
import { unstable_setRequestLocale } from "next-intl/server"

interface AccountPageProps {
  params: { locale: string }
}

export default function AccountPage({ params: { locale } }: AccountPageProps) {
  unstable_setRequestLocale(locale)

  const accountPages = [
    {
      title: "Profile",
      description: "Manage your personal information",
      icon: User,
      href: "/account/profile",
    },
    {
      title: "Settings",
      description: "Configure your account preferences",
      icon: Settings,
      href: "/account/settings",
    },
    {
      title: "Billing",
      description: "Manage your subscription and payment methods",
      icon: CreditCard,
      href: "/account/billing",
    },
    {
      title: "Notifications",
      description: "Control how you receive alerts and updates",
      icon: Bell,
      href: "/account/notifications",
    },
    {
      title: "Security",
      description: "Protect your account with security features",
      icon: Shield,
      href: "/account/security",
    },
    {
      title: "Help & Support",
      description: "Get assistance with your account",
      icon: HelpCircle,
      href: "/account/help",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account Overview</h2>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accountPages.map((page) => (
          <Link href={page.href} key={page.href} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="rounded-md bg-primary/10 p-2">
                  <page.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{page.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

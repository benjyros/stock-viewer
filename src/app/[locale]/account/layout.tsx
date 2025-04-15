import type React from "react"
import { unstable_setRequestLocale } from "next-intl/server"
import { AccountLayout } from "@/components/account-layout"

interface AccountRootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function AccountRootLayout({ children, params: { locale } }: AccountRootLayoutProps) {
  unstable_setRequestLocale(locale)

  return <AccountLayout>{children}</AccountLayout>
}

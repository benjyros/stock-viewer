import { ProfileForm } from "@/components/profile-form"
import { unstable_setRequestLocale } from "next-intl/server"

interface ProfilePageProps {
  params: { locale: string }
}

export default function ProfilePage({ params: { locale } }: ProfilePageProps) {
  unstable_setRequestLocale(locale)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
      </div>

      <ProfileForm />
    </div>
  )
}

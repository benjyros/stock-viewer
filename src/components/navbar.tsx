"use client"

import TeamSwitcher from "./team-switcher"
import { MainNav } from "./main-nav"
import { Search } from "./search"
import UserNav from "./user-nav"
import type { Session } from "@/lib/auth"

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <div className="fixed top-0 w-full border-b border-b-foreground/10 h-16 bg-background z-50">
      <div className="container flex h-16 items-center">
        <TeamSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <UserNav session={session} />
        </div>
      </div>
    </div>
  )
}

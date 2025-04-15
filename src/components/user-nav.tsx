'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { useUser } from "@/context/UserContext";
import { authClient } from "@/lib/auth-client";
import { Session } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
}

export default function UserNav({ session }: { session: Session | null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const { userDetails } = useUser();

  useEffect(() => {
    setIsMounted(true);
    async function refreshSession() {
      try {
        const { data } = await authClient.getSession();
        setUser(data?.user ?? null);
      } catch (error) {
        console.error("Error refreshing session:", error);
      }
    }
    refreshSession();
  }, []);
  
  const handleSignOut = async () => {
    try {
      toast({
        description: <div className="flex gap-2 content-center"><Loader2 className="animate-spin" />Signing out...</div>,
      })
      const { error } = await authClient.signOut();
      if (!error) {
        window.location.href = pathname;
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        })
        console.error("Sign out error:", error.message);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Sign out failed",
      })
    }
  };

  if (!isMounted) {
    return null;
  }

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {userDetails?.user_metadata?.avatar_url ? (
              <AvatarImage
                src={userDetails.user_metadata.avatar_url}
                alt={userDetails?.user_metadata?.displayName || "User Avatar"}
              />
            ) : (
              <AvatarFallback>
                {userDetails?.firstname && userDetails?.firstname
                  ? userDetails.firstname.charAt(0) +
                    userDetails.lastname?.charAt(0)
                  : "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userDetails?.user_metadata.displayName ?? "Guest"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userDetails?.email || "Not logged in"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button asChild size="sm" variant={"outline"}>
      <Link href={`/sign-in?redirectedFrom=${encodeURIComponent(pathname)}`}>
        Sign in
      </Link>
    </Button>
  );
}

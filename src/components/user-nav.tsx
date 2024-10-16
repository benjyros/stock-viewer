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
import { Link } from "@/i18n/routing";
import { useUser } from "../context/UserContext";
import { signOut } from "@/lib/supabase/authClient";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function UserNav() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { userDetails, loading } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      // Redirect to the current page (or elsewhere) to trigger the middleware
      window.location.href = pathname;
    } else {
      console.error("Error during sign out:", error.message);
    }
  };
  if (!isMounted) {
    return null;
  }

  return userDetails || loading ? (
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
                {userDetails?.firstName && userDetails?.firstName
                  ? userDetails.firstName.charAt(0) +
                    userDetails.lastName?.charAt(0)
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

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
  user_metadata: {
    displayName?: string;
    avatar_url?: string;
  };
  firstName?: string;
  lastName?: string;
}

interface UserContextProps {
  userDetails: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserDetails = async (user: any) => {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("firstName, lastName")
        .eq("id", user.id)
        .single();

      setUserDetails({
        ...user,
        ...userData,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);

        if (event === "SIGNED_IN" && session) {
          await fetchUserDetails(session.user);
        } else if (event === "SIGNED_OUT") {
          setUserDetails(null);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await fetchUserDetails(user);
        } else {
          setUserDetails(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user on load:", error);
        setUserDetails(null);
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  return (
    <UserContext.Provider value={{ userDetails, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

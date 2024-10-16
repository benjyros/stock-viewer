"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  const fetchUserDetails = async (user: any) => {
    try {
      console.log("Fetching user details for:", user.id);
      const { data: userData, error } = await supabase
        .from("users")
        .select("firstName, lastName")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error; // Throw the error to be caught in the catch block
      }

      console.log("User data fetched:", userData);

      setUserDetails({
        ...user,
        ...userData,
      });
    } catch (error) {
      console.error("Fetch user details exception:", error);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setLoading(true);
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
          setLoading(true);
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
  }, []);

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

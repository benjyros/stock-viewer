"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
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

// Helper to fetch additional details.
async function fetchUserDetails(user: any, setUserDetails: (user: User | null) => void, setLoading: (loading: boolean) => void) {
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("firstName, lastName")
      .eq("id", user.id)
      .single();
    if (error) throw error;
    console.log("User data fetched:", userData);
    setUserDetails({ ...user, ...userData });
  } catch (error) {
    console.error("Fetch user details exception:", error);
    setUserDetails(null);
  } finally {
    setLoading(false);
  }
}

// Helper function to get cookie value by name.
const getCookie = (cookieName: string): string | null => {
  const nameEQ = cookieName + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeUser = async () => {
    // Option 1: Try to extract tokens from cookies.
    // Adjust these cookie names if needed.
    const access_token = getCookie("supabase.auth.access_token");
    const refresh_token = getCookie("supabase.auth.refresh_token");

    if (access_token && refresh_token) {
      console.log("Found tokens in cookies:", access_token, refresh_token);
      try {
        // Set the session manually using the tokens from cookies.
        await supabase.auth.setSession({ access_token, refresh_token });
        // Re-fetch the session from the client.
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session after setting tokens:", session);
        if (session && session.user) {
          await fetchUserDetails(session.user, setUserDetails, setLoading);
          return;
        } else {
          console.log("No session found after manually setting tokens.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error setting session with tokens:", error);
        setLoading(false);
      }
    } else {
      console.log("Tokens not available in cookies.");
    }

    // Option 2: Fallback to getting the session normally.
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Session from supabase.auth.getSession():", session);
    if (session && session.user) {
      await fetchUserDetails(session.user, setUserDetails, setLoading);
    } else {
      console.log("No session found.");
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeUser();

    // Listen for auth state changes.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session);
        if (session && session.user) {
          await fetchUserDetails(session.user, setUserDetails, setLoading);
        } else {
          setUserDetails(null);
          setLoading(false);
        }
      }
    );
    return () => {
      authListener.subscription?.unsubscribe();
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

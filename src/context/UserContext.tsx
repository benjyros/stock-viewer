"use client";

import { authClient } from "@/lib/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  user_metadata: {
    displayName?: string;
    avatar_url?: string;
  };
  firstname?: string;
  lastname?: string;
}

interface UserContextProps {
  userDetails: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// Helper to fetch additional details.
async function fetchUserDetails(user: any, setUserDetails: (user: User | null) => void, setLoading: (loading: boolean) => void) {
  try {

  const { data: session, error } = await authClient.getSession()
    // const { data: userData, error } = await supabase
    //   .from("users")
    //   .select("firstname, lastname")
    //   .eq("uid", user.id)
    //   .single();
    // if (error) throw error;
    // setUserDetails({ ...user, ...userData });
  } catch (error) {
    console.error("Fetch user details exception:", error);
    setUserDetails(null);
  } finally {
    setLoading(false);
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeUser = async () => {

  const { data: session, error } = await authClient.getSession()
  
    // const { data: { user } } = await supabase.auth.getUser();
    // if (user) {
    //   await fetchUserDetails(user, setUserDetails, setLoading);
    // } else {
    //   console.log("No session found.");
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    initializeUser();

    // Listen for auth state changes.
    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     if (session && session.user) {
    //       await fetchUserDetails(session.user, setUserDetails, setLoading);
    //     } else {
    //       setUserDetails(null);
    //       setLoading(false);
    //     }
    //   }
    // );
    // return () => {
    //   authListener.subscription?.unsubscribe();
    // };
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

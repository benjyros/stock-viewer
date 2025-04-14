import { createClient } from "./client";

const supabase = createClient();

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log("log after sign in", data);

    if (error) {
        console.error("Error during sign-in:", error);
        return { error };
    }

    // You don't need to call setSession manually here
    // The session will be automatically handled by Supabase
    return { data };  // This already contains session info
}

export const signOut = async () => {
    return await supabase.auth.signOut();
}
import { createClient } from "./client";

const supabase = createClient();

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error("Error during sign-in:", error);
        return { error };
    }
    return { data };
}

export const signOut = async () => {
    return await supabase.auth.signOut();
}
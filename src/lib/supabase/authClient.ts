import { createClient } from "./client";

const supabase = createClient();

export const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { error };
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
}
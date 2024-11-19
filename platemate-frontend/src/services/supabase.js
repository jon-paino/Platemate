import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_KEY
);

export async function createSupabaseAccount(email, password) {
    const { error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    return error?.message ?? 'Success';
}

export async function loginSupabaseAccount(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    return error?.message ?? 'Success';
}

export async function logoutSupabaseAccount() {
    await supabase.auth.signOut();
}

export async function getUserSession() {
    const { data: session, error } = await supabase.auth.getSession();
    return session;
}

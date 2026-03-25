import { supabase } from "@/utils/supabase/client";

export async function signUpUser(email: string, password: string, options?: object) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: options, // Optional: add metadata like 'username' here
  });

  if (error) {
    console.error("Sign up error:", error.message);
    return;
  }

  console.log("User signed up:", data.user);
}

export async function logInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Log in error:", error.message);
    return;
  }

  console.log("User logged in:", data.session);
}

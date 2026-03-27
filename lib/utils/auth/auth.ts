import "client-only"

import { supabase } from "@/lib/utils/supabase/client"

export async function signUpUser(
  email: string,
  password: string,
  options?: object,
) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: options, // Optional: add metadata like 'username' here
  })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function logInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function logOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
}

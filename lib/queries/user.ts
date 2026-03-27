import { useQuery } from "@tanstack/react-query"
import { supabase } from "../utils/supabase/client"

export function getUser() {
  return useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    },
    staleTime: Infinity, // user data doesn't go stale automatically
  })
}

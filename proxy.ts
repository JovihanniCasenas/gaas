import { createClient } from "@/lib/utils/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith("/login")

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
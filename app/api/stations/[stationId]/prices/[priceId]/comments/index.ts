import { createClient } from "@/lib/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET({
  params,
}: {
  params: Promise<{ priceId: string }>
}) {
  const supabase = await createClient(cookies())
  const { priceId } = await params

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("*")
    .eq("price_id", priceId)

  if (commentsError) {
    console.error("Error fetching comments:", commentsError)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    )
  }

  return NextResponse.json({ comments })
}

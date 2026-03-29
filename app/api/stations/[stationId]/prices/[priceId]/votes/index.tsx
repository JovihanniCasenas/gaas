import { createClient } from "@/lib/utils/supabase/server"
import type { VoteInsert } from "@/lib/types"
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

  const { data: price } = await supabase
    .from("prices_with_votes")
    .select("upvotes, downvotes")
    .eq("id", priceId)
    .single()

  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 404 })
  }

  return NextResponse.json({
    upvotes: price.upvotes,
    downvotes: price.downvotes,
  })
}

export async function POST({
  params,
  request,
}: {
  params: Promise<{ priceId: string }>
  request: Request
}) {
  const supabase = await createClient(cookies())
  const { priceId } = await params

  let body: VoteInsert
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: price } = await supabase
    .from("prices_with_votes")
    .select("upvotes, downvotes")
    .eq("id", priceId)
    .single()

  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 404 })
  }

  const existingVote = await supabase
    .from("votes")
    .select("*")
    .eq("price_id", priceId)
    .eq("user_id", user.id)
    .single()

  if (existingVote.data) {
    if (existingVote.data.vote_type === body.vote_type) {
      const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.data.id)
      if (deleteError) {
        console.error("Error deleting vote:", deleteError)
        return NextResponse.json(
          { error: "Failed to remove vote" },
          { status: 500 },
        )
      }
    } else {
      const { error: updateError } = await supabase
        .from("votes")
        .update({ vote_type: body.vote_type })
        .eq("id", existingVote.data.id)
      if (updateError) {
        console.error("Error updating vote:", updateError)
        return NextResponse.json(
          { error: "Failed to update vote" },
          { status: 500 },
        )
      }
    }
  } else {
    const { error: upsertError } = await supabase.from("votes").upsert(
      {
        price_id: priceId,
        user_id: user.id,
        vote_type: body.vote_type,
      },
      { onConflict: "user_id,price_id" },
    )
    if (upsertError) {
      console.error("Error upserting vote:", upsertError)
      return NextResponse.json(
        { error: "Failed to cast vote" },
        { status: 500 },
      )
    }
  }

  const { data: updatedPrice, error: updatedPriceError } = await supabase
    .from("prices_with_votes")
    .select("upvotes, downvotes")
    .eq("id", priceId)
    .single()

  if (updatedPriceError || !updatedPrice) {
    console.error("Error fetching updated vote counts:", updatedPriceError)
    return NextResponse.json(
      { error: "Failed to fetch updated vote counts" },
      { status: 500 },
    )
  }

  return NextResponse.json({
    upvotes: updatedPrice.upvotes,
    downvotes: updatedPrice.downvotes,
  })
}

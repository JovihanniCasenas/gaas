import { createClient } from "@/lib/utils/supabase/server"
import type { PriceUpdate } from "@/lib/types"
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

  const { data: price, error: priceError } = await supabase
    .from("prices_with_votes")
    .select("*")
    .eq("id", priceId)
    .single()

  if (priceError) {
    if (priceError.code === "PGRST116") {
      return NextResponse.json({ error: "Price not found" }, { status: 404 })
    }
    console.error("Error fetching price:", priceError)
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 },
    )
  }

  return NextResponse.json({ price })
}

export async function DELETE({
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

  const { error: deleteError } = await supabase
    .from("prices")
    .delete()
    .eq("id", priceId)

  if (deleteError) {
    console.error("Error deleting price:", deleteError)
    return NextResponse.json(
      { error: "Failed to delete price" },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Price deleted successfully" })
}

export async function PATCH({
  params,
  request,
}: {
  params: Promise<{ priceId: string }>
  request: Request
}) {
  const supabase = await createClient(cookies())
  const { priceId } = await params

  let body: PriceUpdate
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

  const updates: PriceUpdate = {
    updated_at: new Date().toISOString(),
  }
  if (body.image_url !== undefined) updates.image_url = body.image_url
  if (body.amount !== undefined) updates.amount = body.amount
  if (body.fuel_type !== undefined) updates.fuel_type = body.fuel_type
  if (body.currency !== undefined) updates.currency = body.currency
  if (body.description !== undefined) updates.description = body.description

  const { data: price, error: updateError } = await supabase
    .from("prices")
    .update(updates)
    .eq("id", priceId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error updating price:", updateError)
    return NextResponse.json(
      { error: "Failed to update price" },
      { status: 500 },
    )
  }

  return NextResponse.json({ price })
}

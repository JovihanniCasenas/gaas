import { createClient } from "@/lib/utils/supabase/server"
import type { PriceInsert } from "@/lib/types"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET({
  params,
}: {
  params: Promise<{ stationId: string }>
}) {
  const supabase = await createClient(cookies())
  const { stationId } = await params

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: prices, error: pricesError } = await supabase
    .from("prices_with_votes")
    .select("*")
    .eq("station_id", stationId)

  if (pricesError) {
    console.error("Error fetching prices:", pricesError)
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 },
    )
  }

  return NextResponse.json({ prices })
}

export async function POST({
  params,
  request,
}: {
  params: Promise<{ stationId: string }>
  request: Request
}) {
  const supabase = await createClient(cookies())
  const { stationId } = await params

  let body: PriceInsert
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

  const { data: price, error: insertError } = await supabase
    .from("prices")
    .insert({
      image_url: body.image_url,
      amount: body.amount,
      fuel_type: body.fuel_type,
      currency: body.currency,
      description: body.description,
      station_id: stationId,
      created_by: user.id,
    })
    .select("*")
    .single()

  if (insertError) {
    console.error("Error inserting price:", insertError)
    return NextResponse.json({ error: "Failed to add price" }, { status: 500 })
  }

  return NextResponse.json({ price })
}

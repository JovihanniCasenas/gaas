import { createClient } from "@/lib/utils/supabase/server"
import type { SavedStationInsert } from "@/lib/types"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient(cookies())

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: stations, error: stationsError } = await supabase
    .from("saved_stations")
    .select("*")
    .eq("user_id", user.id)

  if (stationsError) {
    console.error("Error fetching saved stations:", stationsError)
    return NextResponse.json(
      { error: "Failed to fetch saved stations" },
      { status: 500 },
    )
  }

  return NextResponse.json({ stations })
}

export async function POST({ request }: { request: Request }) {
  const supabase = await createClient(cookies())

  let body: SavedStationInsert
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

  const { data: stations, error: insertError } = await supabase
    .from("saved_stations")
    .insert({
      station_id: body.station_id,
      user_id: user.id,
    })
    .select("*")

  if (insertError) {
    console.error("Error saving station:", insertError)
    return NextResponse.json(
      { error: "Failed to save station" },
      { status: 500 },
    )
  }

  return NextResponse.json({ stations })
}

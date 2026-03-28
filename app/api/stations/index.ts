import { createClient } from "@/lib/utils/supabase/server"
import type { StationInsert } from "@/lib/types"
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
    .from("stations")
    .select("*")

  if (stationsError) {
    console.error("Error fetching stations:", stationsError)
    return NextResponse.json(
      { error: "Failed to fetch stations" },
      { status: 500 },
    )
  }

  return NextResponse.json({ stations })
}

export async function POST({ request }: { request: Request }) {
  const supabase = await createClient(cookies())

  let body: StationInsert
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

  const { data: station, error: insertError } = await supabase
    .from("stations")
    .insert({
      name: body.name,
      location: body.location,
      created_by: user.id,
    })
    .select("*")
    .single()

  if (insertError) {
    console.error("Error creating station:", insertError)
    return NextResponse.json(
      { error: "Failed to create station" },
      { status: 500 },
    )
  }

  return NextResponse.json({ station })
}

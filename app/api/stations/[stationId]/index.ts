import { createClient } from "@/lib/utils/supabase/server"
import type { StationUpdate } from "@/lib/types"
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

  const { data: station, error: stationError } = await supabase
    .from("stations")
    .select("*")
    .eq("id", stationId)
    .single()

  if (stationError) {
    console.error("Error fetching station:", stationError)
    return NextResponse.json(
      { error: "Failed to fetch station" },
      { status: 500 },
    )
  }

  return NextResponse.json({ station })
}

export async function DELETE({
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

  const { error: deleteError } = await supabase
    .from("stations")
    .delete()
    .eq("id", stationId)

  if (deleteError) {
    console.error("Error deleting station:", deleteError)
    return NextResponse.json(
      { error: "Failed to delete station" },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Station deleted successfully" })
}

export async function PATCH({
  params,
  request,
}: {
  params: Promise<{ stationId: string }>
  request: Request
}) {
  const supabase = await createClient(cookies())
  const { stationId } = await params

  let body: StationUpdate
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

  const updates: StationUpdate = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  }
  if (body.name !== undefined) updates.name = body.name
  if (body.location !== undefined) updates.location = body.location

  const { data: station, error: updateError } = await supabase
    .from("stations")
    .update(updates)
    .eq("id", stationId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error updating station:", updateError)
    return NextResponse.json(
      { error: "Failed to update station" },
      { status: 500 },
    )
  }

  return NextResponse.json({ station })
}

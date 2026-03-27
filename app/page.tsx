import { createClient } from "@/lib/utils/supabase/server"
import { cookies } from "next/headers"

export default async function Page() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data: stations } = await supabase.from("stations").select()

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <ul>
        {stations?.map((station) => (
          <li key={station.id} className="mb-2">
            <h2 className="text-xl font-semibold">{station.name}</h2>
            <p>{station.location}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

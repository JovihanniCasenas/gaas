"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { logOutUser } from "@/lib/utils/auth/auth"
import { getUser } from "@/lib/queries/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AppSidebar() {
  const router = useRouter()
  const { data: user } = getUser()
  const [isLoading, setIsLoading] = useState(false)
  const { toggleSidebar } = useSidebar()

  const handleLogout = async () => {
    setIsLoading(true)
    const { success, error } = await logOutUser()
    if (!success) {
      toast.error(`Logout failed. ${error}.`)
    } else {
      router.push("/login")
    }
    setIsLoading(false)
    toggleSidebar()
  }

  return (
    <Sidebar side="right">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <Button
            variant="outline"
            intent="destructive"
            size="sm"
            className="w-full"
            isLoading={isLoading}
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

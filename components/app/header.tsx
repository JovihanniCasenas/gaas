import { SidebarTrigger } from "../ui/sidebar"
import Image from "next/image"

export default function AppHeader() {
    return (
        <div className="flex items-center justify-between w-full h-20 px-4 shadow-lg">
            <Image src="/text-logo.png" alt="Gaas Logo" width={128} height={32} />
            <SidebarTrigger />
        </div>
    )
}
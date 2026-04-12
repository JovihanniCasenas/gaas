import type { Metadata } from "next"
import { Geist, Geist_Mono, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "@/components/app/header"
import AppSidebar from "@/components/app/sidebar"
import Providers from "./providers"

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gaas",
  description: "Community-backed gas prices tracker",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("font-sans", sourceSans3.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-gray-700">
          <div className="w-full max-w-[450px] h-screen mx-auto flex flex-col bg-background">
            <Providers>
              <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0 h-screen">
                  <AppHeader />
                  <div
                    style={{
                      height: "calc(100vh - 128px)",
                      padding: "16px",
                    }}
                  >
                    {children}
                  </div>
                </div>
                <Toaster position="top-center" />
              </SidebarProvider>
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}

"use client";

import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { useAuth } from "@/features/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { accessToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!accessToken){
      router.push('/loading')
    }
  }, []);

  return (
    <div className="flex h-screen bg-white text-black">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  )
}
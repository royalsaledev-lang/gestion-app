"use client"

import { useAuth } from "@/features/auth/auth-provider"
import { SidebarItem } from "./sidebar-item"

export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">

      <div className="p-4 font-bold text-lg">
        RS Platform
      </div>

      <nav className="flex flex-col gap-1 p-2">

        <SidebarItem label="Dashboard" href="/dashboard" />
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (<SidebarItem label="Clients" href="/clients" />)}
        <SidebarItem label="Projects" href="/projects" />
        {(user?.role === "PRESTATAIRE") && (<SidebarItem label="Members" href="/members" />)}
        { (user?.role === "ADMIN" || user?.role === "MANAGER") && (<SidebarItem label="Prestataires" href="/freelancers" />)}
        { (user?.role === "ADMIN" || user?.role === "MANAGER") && (<SidebarItem label="Users" href="/users" />)}

      </nav>

      <div className="mt-auto p-2 border-t">

        <SidebarItem label="Settings" href="/settings" />

      </div>

    </aside>
  )
}
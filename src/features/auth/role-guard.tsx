"use client"

import { ReactNode } from "react"
import { useAuth } from "./auth-provider"
import { UserRole } from "@/types/database"

interface Props {

  roles: UserRole[]
  children: ReactNode

}

export function RoleGuard({ roles, children }: Props) {

  const { user } = useAuth()

  if (!user) {
    return <div>Not authenticated</div>
  }

  if (!roles.includes(user.role)) {
    return <div>Access denied</div>
  }

  return <>{children}</>

}
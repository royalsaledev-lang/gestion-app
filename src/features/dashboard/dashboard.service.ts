import {
  Project,
  Task,
  ActivityLog,
} from "@/types/database"

import { DashboardStats } from "@/types/dashboard"

export interface RevenueItem {
  month: string
  revenue: number
}

export interface DashboardResponse {
  stats: DashboardStats
  projects: Project[]
  tasks: Task[]
  activities: ActivityLog[]
  revenueData: RevenueItem[]
}

export async function getDashboard(
  token: string
): Promise<DashboardResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur dashboard")
  }

  return res.json()
}
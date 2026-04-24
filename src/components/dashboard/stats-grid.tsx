import { DashboardStats } from "@/types/dashboard"
import { StatCard } from "./stat-card"

interface Props {
  stats: DashboardStats
}

export function StatsGrid({ stats }: Props) {

  return (
    <div className="grid grid-cols-4 gap-4">

      <StatCard
        title="Total Clients"
        value={stats.totalClients}
      />

      <StatCard
        title="Active Projects"
        value={stats.activeProjects}
      />

      <StatCard
        title="Tasks In Progress"
        value={stats.tasksInProgress}
      />

      <StatCard
        title="Revenue Expected"
        value={`$${stats.revenueExpected}`}
      />

    </div>
  )
}
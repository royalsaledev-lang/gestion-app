"use client";

import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TasksSummary } from "@/components/dashboard/tasks-summary"
import { ProjectsSummary } from "@/components/dashboard/projects-summary"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardStats } from "@/types/dashboard"
import { ActivityFeed } from "@/features/activity/activity-feed"
import { Task, Project } from "@/types/database"

import { useEffect, useState } from "react"

import { useAuth } from "@/features/auth/auth-provider"

import {
  getDashboard,
  DashboardResponse,
} from "@/features/dashboard/dashboard.service"


export default function DashboardPage() {
const [data, setData] =
  useState<DashboardResponse | null>(null)

const { accessToken } = useAuth()

useEffect(() => {
  if (!accessToken) return

  getDashboard(accessToken)
    .then(setData)
}, [accessToken])


if (!data) {
  return (
    <div>
      Chargement...
    </div>
  )
}

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <StatsGrid stats={data.stats} />

      <RevenueChart data={data.revenueData} />

      <div className="grid grid-cols-2 gap-4">

        <TasksSummary tasks={data.tasks} />

        <ProjectsSummary projects={data.projects} />

      </div>

      <RecentActivity activities={data.activities} />

      <ActivityFeed 
        activities={
            [
                {
                    id: "1",
                    action: "TASK_ASSIGNED",
                    taskId: "1",
                    createdAt: new Date().toISOString(),
                    user: {
                        id: "1",
                        name: "Jean",
                        email: "jean@email.com",
                        role: "MANAGER",
                        active: true,
                        createdAt: "",
                        updatedAt: ""
                    }
                }
            ]
        } />

    </div>

  )
}



// import { StatsGrid } from "@/components/dashboard/stats-grid"
// import { RevenueChart } from "@/components/dashboard/revenue-chart"
// import { TasksSummary } from "@/components/dashboard/tasks-summary"
// import { ProjectsSummary } from "@/components/dashboard/projects-summary"
// import { RecentActivity } from "@/components/dashboard/recent-activity"
// import { DashboardStats } from "@/types/dashboard"
// import { ActivityFeed } from "@/features/activity/activity-feed"

// const stats: DashboardStats = {

//   totalClients: 12,
//   activeClients: 8,
//   clientsToFollow: 2,

//   totalProjects: 7,
//   activeProjects: 3,
//   completedProjects: 2,
//   blockedProjects: 1,

//   tasksInProgress: 5,
//   tasksCompleted: 10,
//   tasksLate: 1,

//   freelancersActive: 4,

//   revenueExpected: 5000,
//   revenueReceived: 3000
// }

// const revenueData = [
//   { month: "Jan", revenue: 1000 },
//   { month: "Feb", revenue: 1500 },
//   { month: "Mar", revenue: 2000 }
// ]

// export default function DashboardPage() {

//   return (

//     <div className="space-y-6">

//       <h1 className="text-2xl font-semibold">
//         Dashboard
//       </h1>

//       <StatsGrid stats={stats} />

//       <RevenueChart data={revenueData} />

//       <div className="grid grid-cols-2 gap-4">

//         <TasksSummary tasks={[]} />

//         <ProjectsSummary projects={[]} />

//       </div>

//       <RecentActivity activities={[]} />

//       <ActivityFeed
//             activities={[
//                 {
//                 id: "1",
//                 action: "TASK_ASSIGNED",
//                 taskId: "1",
//                 createdAt: new Date().toISOString(),
//                 user: {
//                     id: "1",
//                     name: "Jean",
//                     email: "jean@email.com",
//                     role: "MANAGER",
//                     active: true,
//                     createdAt: "",
//                     updatedAt: ""
//                 }
//                 }
//             ]}
//         />

//     </div>

//   )
// }
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TasksSummary } from "@/components/dashboard/tasks-summary"
import { ProjectsSummary } from "@/components/dashboard/projects-summary"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardStats } from "@/types/dashboard"
import { ActivityFeed } from "@/features/activity/activity-feed"
import { Task, Project } from "@/types/database"

const stats: DashboardStats = {

  totalClients: 12,
  activeClients: 8,
  clientsToFollow: 2,

  totalProjects: 7,
  activeProjects: 3,
  completedProjects: 2,
  blockedProjects: 1,

  tasksInProgress: 5,
  tasksCompleted: 10,
  tasksLate: 1,

  freelancersActive: 4,

  revenueExpected: 5000,
  revenueReceived: 3000
}

const revenueData = [
  { month: "Jan", revenue: 1000 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 3000 }
]

const tasks: Task[] = [
  {
    id: "1",
    title: "Create landing page",
    description: "Design marketing landing page",
    status: "IN_PROGRESS",
    priority: "HIGH",
    projectId: "1",
    createdById: "1",
    assignedToId: "2",
    startDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "SEO optimization",
    description: "Improve SEO for homepage",
    status: "DRAFT",
    priority: "MEDIUM",
    projectId: "2",
    createdById: "1",
    assignedToId: "3",
    startDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
]

const projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "New website for client",
    status: "IN_PROGRESS",
    priority: "HIGH",
    startDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    clientId: "1",
    managerId: "1",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "SEO Campaign",
    description: "3 months SEO campaign",
    status: "UPCOMING",
    priority: "MEDIUM",
    startDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
    clientId: "2",
    managerId: "2",
    createdAt: new Date().toISOString()
  }
]

const activities = [
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
  },
  {
    id: "2",
    action: "COMMENT_ADDED",
    taskId: "1",
    createdAt: new Date().toISOString(),
    user: {
      id: "2",
      name: "Marc",
      email: "marc@email.com",
      role: "EXECUTANT",
      active: true,
      createdAt: "",
      updatedAt: ""
    }
  },
  {
    id: "3",
    action: "PAYMENT_RECEIVED",
    taskId: "1",
    createdAt: new Date().toISOString(),
    user: {
      id: "3",
      name: "Admin",
      email: "admin@email.com",
      role: "ADMIN",
      active: true,
      createdAt: "",
      updatedAt: ""
    }
  }
]

const activitiesFeed = [
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

export default function DashboardPage() {

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <StatsGrid stats={stats} />

      <RevenueChart data={revenueData} />

      <div className="grid grid-cols-2 gap-4">

        <TasksSummary tasks={tasks} />

        <ProjectsSummary projects={projects} />

      </div>

      <RecentActivity activities={activities} />

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
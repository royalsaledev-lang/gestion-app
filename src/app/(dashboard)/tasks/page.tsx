"use client";

import { DataTable } from "@/components/tables/data-table"
import { taskColumns } from "@/features/tasks/tasks-columns"
import { Task } from "@/types/database"

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
  }
]

export default function TasksPage() {

  return (

    <div className="space-y-4">

      <h1 className="text-xl font-semibold">
        Tasks
      </h1>

      <DataTable
        columns={taskColumns}
        data={tasks}
      />

    </div>
  )
}
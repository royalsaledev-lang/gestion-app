import { ColumnDef } from "@tanstack/react-table"
import { Task } from "@/types/database"
import { TaskStatusBadge } from "./task-status-badge"

export const taskColumns: ColumnDef<Task>[] = [

  {
    accessorKey: "title",
    header: "Task"
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <TaskStatusBadge status={row.original.status} />
    )
  },

  {
    accessorKey: "priority",
    header: "Priority"
  },

  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => row.original.deadline ?? "-"
  }

]
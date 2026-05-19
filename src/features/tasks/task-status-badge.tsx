import { TaskStatus } from "@/types/database"

interface Props {
  status: TaskStatus
}

export function TaskStatusBadge({ status }: Props) {

  const colors: Record<TaskStatus, string> = {

    DRAFT: "bg-gray-100 text-gray-700",

    VALIDATION_REQUESTED: "bg-yellow-100 text-yellow-700",

    APPROVED: "bg-blue-100 text-blue-700",

    IN_PROGRESS: "bg-purple-100 text-purple-700",

    COMPLETED: "bg-green-100 text-green-700",

    REJECTED: "bg-red-100 text-red-700"
  }

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
      {status}
    </span>
  )
}
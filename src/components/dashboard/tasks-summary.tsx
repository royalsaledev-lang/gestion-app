import { Task } from "@/types/database"

interface Props {
  tasks: Task[]
}

export function TasksSummary({ tasks }: Props) {

  const inProgress = tasks.filter(
    t => t.status === "IN_PROGRESS"
  ).length

  const completed = tasks.filter(
    t => t.status === "COMPLETED"
  ).length

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      <h3 className="text-sm font-medium mb-4">
        Sommaire Tâches
      </h3>

      <div className="space-y-2">

        <p>En progrès: {inProgress}</p>

        <p>Complète: {completed}</p>

      </div>

    </div>
  )
}
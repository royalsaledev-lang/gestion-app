import { Task } from "@/types/database"

interface Props {
  tasks: Task[]
}

export function TaskKanban({ tasks }: Props) {

  const columns = {

    todo: tasks.filter(t => t.status === "DRAFT"),

    progress: tasks.filter(t => t.status === "IN_PROGRESS"),

    done: tasks.filter(t => t.status === "COMPLETED")

  }

  return (

    <div className="grid grid-cols-3 gap-4">

      {Object.entries(columns).map(([key, value]) => (

        <div key={key} className="bg-gray-50 p-3 rounded-xl">

          <h3 className="text-sm font-medium mb-2">
            {key.toUpperCase()}
          </h3>

          <div className="space-y-2">

            {value.map(task => (

              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg p-3"
              >
                {task.title}
              </div>

            ))}

          </div>

        </div>

      ))}

    </div>

  )
}
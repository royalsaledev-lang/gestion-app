import { TaskComments } from "@/features/tasks/task-comments"

export default function TaskDetailsPage() {

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Task Details
      </h1>

      <div>
        Task information
      </div>

      <TaskComments comments={[]} />

    </div>
  )
}
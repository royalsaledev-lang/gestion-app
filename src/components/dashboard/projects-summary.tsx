import { Project } from "@/types/database"

interface Props {
  projects: Project[]
}

export function ProjectsSummary({ projects }: Props) {

  const active = projects.filter(
    p => p.status === "IN_PROGRESS"
  ).length

  const completed = projects.filter(
    p => p.status === "COMPLETED"
  ).length

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      <h3 className="text-sm font-medium mb-4">
        Projects Summary
      </h3>

      <div className="space-y-2">

        <p>Active: {active}</p>

        <p>Completed: {completed}</p>

      </div>

    </div>
  )
}
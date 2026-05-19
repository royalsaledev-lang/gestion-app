import { Project } from "@/types/database"

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition">

      <h3 className="font-medium">
        {project.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {project.description}
      </p>

      <div className="mt-3 text-sm">

        <p>Status: {project.status}</p>

        <p>Priority: {project.priority}</p>

      </div>

    </div>
  )
}



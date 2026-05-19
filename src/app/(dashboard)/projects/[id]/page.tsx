"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { ProjectTabs } from "@/features/projects/project-tabs";
import { getProject } from "@/features/projects/project.service";
import { Project } from "@/types/database";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!id && !accessToken) return

    getProject(id, accessToken as string).then(setProject)
  }, [id, accessToken])

  console.log(project);
  

  const getDate = (value: string) => {

    if (!value) return "-"

    const date = new Date(value)

    if (isNaN(date.getTime())) return "-"
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Project Details
      </h1>

      {project && (
        <div className="space-y-4 border p-4 rounded">

          <h2 className="text-xl font-semibold">{project.name}</h2>

          <p>{project.description}</p>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Client: {project.client?.name ?? "-"}</p>
            <p>Manager: {project.manager?.name ?? "-"}</p>
            <p>Début: {getDate(project.startDate as string) ?? "-"}</p>
            <p>Deadline: {getDate(project.deadline as string) ?? "-"}</p>
          </div>

        </div>
      )}

      {id && (<ProjectTabs projectId={id} />)}

    </div>

  )
}





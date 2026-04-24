"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { ProjectForm } from "@/features/projects/project-form"
import { CreateProjectDTO } from "@/types/forms"
import { getProject, updateProject } from "@/features/projects/project.service"

export default function EditProjectPage() {

  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken } = useAuth()
  const [loading,setLoading] = useState(false)

  const [project, setProject] = useState<CreateProjectDTO | null>(null)

  useEffect(() => {
    if (!accessToken) return

    getProject(id, accessToken).then((data) => {
      setProject({
        name: data.name,
        description: data.description,
        priority: data.priority,
        status: data.status,
      })
    })
  }, [id, accessToken])

  async function handleUpdate(data: CreateProjectDTO) {
    if (!accessToken) return

    await updateProject(id, data, accessToken)
    router.push("/projects")
  }

  if (!project) return <p>Loading...</p>

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-[500px] space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Modifier projet
        </h1>

        <ProjectForm initialData={project} loading={loading} onSubmit={handleUpdate} setLoading={setLoading} />
      </div>
    </div>
  )
}




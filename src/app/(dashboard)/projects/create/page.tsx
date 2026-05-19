
"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { ProjectForm } from "@/features/projects/project-form"
import { createProject } from "@/features/projects/project.service"
import { CreateProjectDTO } from "@/types/forms"
import { useState } from "react"

export default function CreateProjectPage() {

  const router = useRouter()
  const { accessToken } = useAuth()
  const [loading,setLoading] = useState(false)

  async function handleCreate(data:CreateProjectDTO) {
    if (!accessToken) return
    await createProject(data, accessToken)
    router.push("/projects")
  }

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-[500px] space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Créer projet
        </h1>

        <ProjectForm loading={loading} onSubmit={handleCreate} setLoading={setLoading} />
      </div>
    </div>
  )
}



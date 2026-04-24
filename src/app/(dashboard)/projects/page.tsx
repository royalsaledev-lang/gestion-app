"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { DataTable } from "@/components/tables/data-table"
import { projectColumns } from "@/features/projects/projects-columns"
import { Project } from "@/types/database"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/features/projects/project.service"

export default function ProjectsPage() {

  const { user, accessToken } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!accessToken) return
    getProjects(accessToken).then(setProjects)
  }, [accessToken, status, search])

  async function fetchProjects() {
    const data = await getProjects(accessToken as string, { search, status })
    setProjects(data)
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Projects
        </h1>

        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (<Button className="cursor-pointer" onClick={() => router.push("/projects/create")}>
          + Ajouter
        </Button>)}
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="flex gap-3">

        <input
          placeholder="Rechercher..."
          className="border px-3 h-10 rounded-lg text-sm w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 h-10 rounded-lg text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="UPCOMING">À venir</option>
          <option value="IN_PROGRESS">En cour</option>
          <option value="COMPLETED">Terminé</option>
          <option value="BLOCKED">Bloqué</option>
          <option value="CANCELLED">Annulé</option>
        </select>

      </div>

      <DataTable columns={projectColumns(fetchProjects)} data={projects} />

    </div>
  )
}




// "use client";

// import { DataTable } from "@/components/tables/data-table"
// import { projectColumns } from "@/features/projects/projects-columns"
// import { Project } from "@/types/database"

// const projects: Project[] = [
//   {
//     id: "1",
//     name: "Website Redesign",
//     description: "New company website",
//     status: "IN_PROGRESS",
//     priority: "HIGH",
//     startDate: new Date().toISOString(),
//     deadline: new Date().toISOString(),
//     clientId: "1",
//     managerId: "1",
//     createdAt: new Date().toISOString()
//   }
// ]

// export default function ProjectsPage() {

//   return (

//     <div className="space-y-4">

//       <h1 className="text-xl font-semibold">
//         Projects
//       </h1>

//       <DataTable
//         columns={projectColumns}
//         data={projects}
//       />

//     </div>

//   )
// }
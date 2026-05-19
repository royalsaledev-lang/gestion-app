"use client"

import { useEffect, useState } from "react"
import { assignFreelancer, getProject } from "@/features/projects/project.service"
import { getFreelancers } from "@/features/freelancers/freelancer.service"
import { useAuth } from "@/features/auth/auth-provider"
import { Freelancer, UserLite, Project, Task } from "@/types/database"
import { ProjectTasks } from "../tasks/project-tasks"
import { getTasks } from "../tasks/task.service"

interface Props {
  projectId: string
}

export function ProjectTabs({ projectId }: Props) {
  const [tab, setTab] = useState<"tasks" | "freelancers" | "payments" | "activity">("tasks")
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterMine, setFilterMine] = useState(false)
  const [members, setMembers] = useState<UserLite[]>([])

  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [project, setProject] = useState<Project | null>(null)

  const [selected, setSelected] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const { accessToken } = useAuth()

  // 🔹 Charger freelancers + projet
  useEffect(() => {
    if (!projectId && !accessToken) return

    async function load() {
      const [allFreelancers, projectData] = await Promise.all([
        getFreelancers(accessToken as string),
        getProject(projectId, accessToken as string),
      ])

      setFreelancers(allFreelancers)
      setProject(projectData)
    }

    load()
  }, [accessToken, projectId])

  console.log(projectId, project);
  

  useEffect(() => {
    if (!projectId && !accessToken) return

    async function load() {
      const projectData = await getProject(projectId, accessToken as string)

      setProject(projectData)

      const allTasks = await getTasks(accessToken as string)
      setTasks(allTasks.filter((t: Task) => t.projectId === projectId))

      // 🔥 récupérer membres via freelancers liés
      const membersList =
        projectData.freelancers?.flatMap(f =>
          f.freelancer?.members ?? []
        ) || []

      // 🔥 ajouter aussi prestataire
      const prestataires =
        projectData.freelancers?.map(f => f.freelancer.user).filter(Boolean) || []

      setMembers([...membersList, ...prestataires])
    }

    load()
  }, [accessToken, projectId])

  console.log(project, members);
  

  // 🔹 assigner
  async function assign() {
    if (!projectId && !accessToken || !selected) return

    try {
      setLoading(true)

      await assignFreelancer(projectId, selected, accessToken as string)

      // 🔥 reload project après assign
      const updatedProject = await getProject(projectId, accessToken as string)
      setProject(updatedProject)

      setSelected("")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 freelancers déjà assignés
  const assignedFreelancers =
    project?.freelancers?.map((f) => f.freelancer)?.filter((f): f is Freelancer => !!f) ?? []

  // 🔹 filtrer dropdown (optionnel mais propre)
  const availableFreelancers = freelancers.filter(
    (f) => !assignedFreelancers.some((a) => a.id === f.id)
  )

  return (
    <div>
      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button className="cursor-pointer" onClick={() => setTab("tasks")}>Tasks</button>
        {(user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "PRESTATAIRE") && (<button className="cursor-pointer" onClick={() => setTab("freelancers")}>Freelancers</button>)}
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (<button className="cursor-pointer" onClick={() => setTab("payments")}>Payments</button>)}
        <button className="cursor-pointer" onClick={() => setTab("activity")}>Activity</button>
      </div>

      <div className="mt-4">
        {tab === "freelancers" && (
          <div className="space-y-6">

            {/* 🔥 LISTE ASSIGNÉE */}
            <div>
              <h3 className="font-medium mb-2">
                Freelancers assignés
              </h3>

              {assignedFreelancers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucun freelancer assigné
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedFreelancers.map((f) => (
                    <div
                      key={f.id}
                      className="border rounded p-3 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{f.name}</p>
                        <p className="text-sm text-gray-500">
                          {f.specialty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🔥 ASSIGNATION */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (<div className="space-y-3">
              <select
                className="w-full h-11 border rounded"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Sélectionner un freelancer</option>

                {availableFreelancers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <button
                disabled={loading || !selected}
                className="w-full h-11 bg-black text-white rounded cursor-pointer"
                onClick={assign}
              >
                {loading ? "Chargement..." : "Assigner"}
              </button>
            </div>)}

          </div>
        )}

        {tab === "tasks" && project && (
          <ProjectTasks membersList={members} project={project} />
        )}

        {tab === "payments" && <div>Project Payments</div>}
        {tab === "activity" && <div>Project Activity</div>}
      </div>
    </div>
  )
}







// "use client"

// import { useEffect, useState } from "react"
// import { assignFreelancer } from "@/features/projects/project.service"
// import { getFreelancers } from "@/features/freelancers/freelancer.service"
// import { useAuth } from "@/features/auth/auth-provider"
// import { Freelancer } from "@/types/database"

// interface Props {
//   projectId: string
// }

// export function ProjectTabs({ projectId }: Props) {
//   const [tab, setTab] = useState<"tasks" | "freelancers" | "payments" | "activity">("tasks")

//   const [freelancers, setFreelancers] = useState<Freelancer[]>([])
//   const [selected, setSelected] = useState<string>("")
//   const [loading, setLoading] = useState(false)

//   const { accessToken } = useAuth()

//   useEffect(() => {
//     if (!accessToken) return

//     getFreelancers(accessToken).then(setFreelancers)
//   }, [accessToken])

//   async function assign() {
//     if (!accessToken || !selected) return
//     try {
//       setLoading(true)
//       await assignFreelancer(projectId, selected, accessToken)
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setTimeout(() => {
//         setLoading(false)
//       }, 2000);
//     }
//   }

//   return (
//     <div>
//       <div className="flex gap-4 border-b pb-2">
//         <button className="cursor-pointer" onClick={() => setTab("tasks")}>Tasks</button>
//         <button className="cursor-pointer" onClick={() => setTab("freelancers")}>Freelancers</button>
//         <button className="cursor-pointer" onClick={() => setTab("payments")}>Payments</button>
//         <button className="cursor-pointer" onClick={() => setTab("activity")}>Activity</button>
//       </div>

//       <div className="mt-4">
//         {tab === "freelancers" && (
//           <div className="space-y-3">

//             <select
//               className="w-full h-11 border rounded"
//               value={selected}
//               onChange={(e) => setSelected(e.target.value)}
//             >
//               <option value="">Select freelancer</option>

//               {freelancers.map((f) => (
//                 <option key={f.id} value={f.id}>
//                   {f.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               disabled={loading}
//               className="w-full h-11 bg-black text-white rounded cursor-pointer"
//               onClick={assign}
//             >
//               {loading ? "Chargement..." : "Assigner"}
//             </button>

//           </div>
//         )}

//         {tab === "tasks" && <div>Project Tasks</div>}
//         {tab === "payments" && <div>Project Payments</div>}
//         {tab === "activity" && <div>Project Activity</div>}
//       </div>
//     </div>
//   )
// }












// import { useEffect, useState } from "react"
// import { assignFreelancer } from "@/features/projects/project.service"
// import { getFreelancers } from "@/features/freelancers/freelancer.service"

// export function ProjectTabs({ projectId }: { projectId: string }) {
//   const [tab, setTab] = useState("tasks")
//   const [freelancers, setFreelancers] = useState<any[]>([])
//   const [selected, setSelected] = useState("")

//   useEffect(() => {
//     getFreelancers().then(setFreelancers)
//   }, [])

//   async function assign() {
//     await assignFreelancer(projectId, selected)
//   }

//   return (
//     <div>
//       <div className="flex gap-4 border-b pb-2">
//         <button onClick={() => setTab("tasks")}>Tasks</button>
//         <button onClick={() => setTab("freelancers")}>Freelancers</button>
//         <button onClick={() => setTab("payments")}>Payments</button>
//         <button onClick={() => setTab("activity")}>Activity</button>
//       </div>

//       <div className="mt-4">
//         {tab === "freelancers" && (
//           <div className="space-y-3">

//             <select
//               className="w-full h-11 border rounded"
//               value={selected}
//               onChange={(e) => setSelected(e.target.value)}
//             >
//               <option value="">Select freelancer</option>

//               {freelancers.map((f) => (
//                 <option key={f.id} value={f.id}>
//                   {f.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               className="w-full h-11 bg-black text-white rounded"
//               onClick={assign}
//             >
//               Assigner
//             </button>

//           </div>
//         )}

//         {tab === "tasks" && <div>Project Tasks</div>}
//         {tab === "payments" && <div>Project Payments</div>}
//         {tab === "activity" && <div>Project Activity</div>}
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { useAuth } from "@/features/auth/auth-provider"
// import { assignFreelancer } from "@/features/projects/project.service"

// export function ProjectTabs({ projectId }: { projectId: string }) {

//   const [tab, setTab] = useState("tasks")
//   const { accessToken } = useAuth()

//   const [freelancerId, setFreelancerId] = useState("")

//   async function handleAssign() {
//     if (!accessToken) return
//     await assignFreelancer(projectId, freelancerId, accessToken)
//     alert("Freelancer assigné")
//   }

//   return (
//     <div>

//       <div className="flex gap-4 border-b pb-2">
//         <button onClick={() => setTab("tasks")}>Tasks</button>
//         <button onClick={() => setTab("freelancers")}>Freelancers</button>
//         <button onClick={() => setTab("payments")}>Payments</button>
//         <button onClick={() => setTab("activity")}>Activity</button>
//       </div>

//       <div className="mt-4">

//         {tab === "tasks" && <div>Project Tasks</div>}

//         {tab === "freelancers" && (
//           <div className="space-y-3">

//             <input
//               className="border p-2 w-full"
//               placeholder="Freelancer ID"
//               value={freelancerId}
//               onChange={(e) => setFreelancerId(e.target.value)}
//             />

//             <button
//               className="bg-black text-white px-4 py-2"
//               onClick={handleAssign}
//             >
//               Assigner
//             </button>

//           </div>
//         )}

//         {tab === "payments" && <div>Project Payments</div>}

//         {tab === "activity" && <div>Project Activity</div>}

//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"

// export function ProjectTabs() {

//   const [tab, setTab] = useState("tasks")

//   return (

//     <div>

//       <div className="flex gap-4 border-b pb-2">

//         <button onClick={() => setTab("tasks")}>
//           Tasks
//         </button>

//         <button onClick={() => setTab("freelancers")}>
//           Freelancers
//         </button>

//         <button onClick={() => setTab("payments")}>
//           Payments
//         </button>

//         <button onClick={() => setTab("activity")}>
//           Activity
//         </button>

//       </div>

//       <div className="mt-4">

//         {tab === "tasks" && <div>Project Tasks</div>}

//         {tab === "freelancers" && <div>Project Freelancers</div>}

//         {tab === "payments" && <div>Project Payments</div>}

//         {tab === "activity" && <div>Project Activity</div>}

//       </div>

//     </div>

//   )
// }
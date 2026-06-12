"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"

import { useAuth } from "@/features/auth/auth-provider"
import { getClientById } from "@/features/clients/clients.service"

import { Client } from "@/types/database"

export default function ClientDetailsPage() {
  const { id } = useParams()

  const { accessToken } = useAuth()

  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")

  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    if (!accessToken || !id) return

    getClientById(id as string, accessToken)
      .then(setClient)
      .catch(console.error)
  }, [id, accessToken])

  const filteredProjects = useMemo(() => {
    if (!client?.projects) return []

    return client.projects.filter((project) => {
      const matchSearch =
        !search ||
        project.name
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchStatus =
        !status || project.status === status

      return matchSearch && matchStatus
    })
  }, [client, search, status])

  if (!client) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">

      {/* Client */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">
          {client.name}
        </h1>

        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <p>Email : {client.email || "-"}</p>
          <p>Téléphone : {client.phone || "-"}</p>
          <p>Société : {client.company || "-"}</p>
          <p>Statut : {client.status}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3">

        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-60"
        >
          <option value="">Tous les statuts</option>
          <option value="DRAFT">Brouillon</option>
          <option value="UPCOMING">À venir</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="COMPLETED">Terminé</option>
          <option value="BLOCKED">Bloqué</option>
        </select>

      </div>

      {/* Projets */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Projets ({filteredProjects.length})
        </h2>

        {filteredProjects.length === 0 ? (
          <div className="border rounded-lg p-6 text-center text-gray-500">
            Aucun projet trouvé
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    {project.name}
                  </h3>

                  <span className="text-xs border rounded-full px-3 py-1">
                    {project.status}
                  </span>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {project.description}
                  </p>
                )}

                {project.manager && (
                  <p className="text-xs text-gray-400 mt-3">
                    Manager : {project.manager.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}


// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"

// import { useAuth } from "@/features/auth/auth-provider"
// import { getClientById } from "@/features/clients/clients.service"

// import { Client } from "@/types/database"

// export default function ClientDetailsPage() {
//   const { id } = useParams()

//   const { accessToken } = useAuth()

//   const [status, setStatus] = useState("")

//   const [search, setSearch] = useState("")

//   const [client, setClient] = useState<Client | null>(null)

// useEffect(() => {
//   if (!accessToken || !id) return

//   getClientById(
//     id as string,
//     accessToken,
//   ).then(setClient)

// }, [id, accessToken, search, status])

//   if (!client) {
//     return <div>Chargement...</div>
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold">
//           {client.name}
//         </h1>

//         <p>{client.email}</p>
//         <p>{client.phone}</p>
//         <p>{client.company}</p>
//         <p>{client.status}</p>
//       </div>

//       <div className="flex gap-3 mb-4">
//   <input
//     placeholder="Rechercher un projet..."
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//     className="border rounded px-3 py-2"
//   />

//   <select
//     value={status}
//     onChange={(e) => setStatus(e.target.value)}
//     className="border rounded px-3 py-2"
//   >
//     <option value="">Tous les statuts</option>
//     <option value="DRAFT">Brouillon</option>
//     <option value="UPCOMING">À venir</option>
//     <option value="IN_PROGRESS">En cours</option>
//     <option value="COMPLETED">Terminé</option>
//     <option value="BLOCKED">Bloqué</option>
//   </select>
// </div>

//       <div>
//         <h2 className="text-lg font-semibold mb-4">
//           Projets ({client.projects?.length || 0})
//         </h2>

//         <div className="space-y-3">
//           {client.projects?.map((project) => (
//             <div
//               key={project.id}
//               className="border rounded p-3"
//             >
//               <h3 className="font-medium">
//                 {project.name}
//               </h3>

//               <p className="text-sm text-gray-500">
//                 {project.status}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
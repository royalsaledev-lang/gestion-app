"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns } from "@/features/clients/clients-columns"
import { useAuth } from "@/features/auth/auth-provider"
import { getClients } from "@/features/clients/clients.service"
import { Client } from "@/types/database"
import { useRouter } from "next/navigation"

export default function ClientsPage() {
  const { accessToken } = useAuth()

  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const router = useRouter()


  useEffect(() => {  
    async function fetchClients() {
      const data = await getClients(accessToken as string)
      setClients(data)
    }

    if (accessToken) fetchClients()
  }, [accessToken, search, status])

  
  async function fetchClients() {
    const data = await getClients(accessToken as string, { search, status })
    setClients(data)
  }

  return (
    <div className="space-y-6">

  {/* HEADER */}
  <div className="flex items-center justify-between">
    
    <h1 className="text-xl font-semibold tracking-tight">
      Clients
    </h1>

    <button
      onClick={() => router.push("/clients/create")}
      className="
        h-10 px-4 rounded-lg
        border border-black
        bg-black text-white
        text-sm font-medium
        hover:bg-white hover:text-black
        transition cursor-pointer
      "
    >
      + Ajouter
    </button>

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
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
      <option value="IN_PROGRESS">En cours</option>
      <option value="TO_FOLLOW">À suivre</option>
      <option value="ISSUE">Problème</option>
    </select>

  </div>

  {/* TABLE */}
  <DataTable
    columns={columns(fetchClients)}
    data={clients}
  />

</div>
    // <div className="space-y-6">

    //   <h1 className="text-xl font-semibold">Clients</h1>

    //   {/* 🔍 FILTER BAR */}
    //   <div className="flex gap-3">

    //     <input
    //       placeholder="Rechercher..."
    //       className="border px-3 h-10 rounded text-sm w-[200px]"
    //       value={search}
    //       onChange={(e) => setSearch(e.target.value)}
    //     />

    //     <select
    //       className="border px-3 h-10 rounded text-sm"
    //       value={status}
    //       onChange={(e) => setStatus(e.target.value)}
    //     >
    //       <option value="">Tous</option>
    //       <option value="ACTIVE">ACTIVE</option>
    //       <option value="INACTIVE">INACTIVE</option>
    //       <option value="IN_PROGRESS">En COUR</option>
    //       <option value="TO_FOLLOW">A SUIVRE</option>
    //       <option value="ISSUE">PROBLEME</option>
    //     </select>

    //   </div>

    //   <DataTable
    //     columns={columns(fetchClients)}
    //     data={clients}
    //   />

    // </div>
  )
}




// "use client"

// import { useEffect, useState } from "react"
// import { DataTable } from "@/components/tables/data-table"
// import { columns } from "@/features/clients/clients-columns"
// import { useAuth } from "@/features/auth/auth-provider"
// import { Client } from "@/types/database"
// import { getClients } from "@/features/clients/clients.service"

// export default function ClientsPage() {
//   const { accessToken } = useAuth()

//   const [clients, setClients] = useState<Client[]>([])
//   const [loading, setLoading] = useState(true)

//   async function fetchClients() {
//     if (!accessToken) return

//     const data = await getClients(accessToken)
//     setClients(data)
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchClients()
//   }, [accessToken])

//   if (loading) return <p className="text-sm">Chargement...</p>

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold">Clients</h1>

//       <DataTable
//         columns={columns(fetchClients)}
//         data={clients}
//       />
//     </div>
//   )
// }

// // "use client";

// // import { DataTable } from "@/components/tables/data-table"
// // import { columns } from "@/features/clients/clients-columns"
// // import { Client } from "@/types/database"

// // const data: Client[] = [
// //   {
// //     id: "1",
// //     name: "Company A",
// //     email: "contact@companya.com",
// //     phone: "12345678",
// //     company: "Company A",
// //     status: "ACTIVE",
// //     createdAt: new Date().toISOString()
// //   }
// // ]

// // export default function ClientsPage() {

// //   return (
// //     <div className="space-y-4">

// //       <h1 className="text-xl font-semibold">
// //         Clients
// //       </h1>

// //       <DataTable columns={columns} data={data} />

// //     </div>
// //   )
// // }
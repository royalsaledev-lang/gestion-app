"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/tables/data-table"
import { userColumns } from "@/features/users/users-columns"
import { User } from "@/types/database"
import { useAuth } from "@/features/auth/auth-provider"
import { getUsers } from "@/features/users/users.service"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const { accessToken, refreshAccessToken, user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  async function fetchUsers() {
    try {
      setLoading(true)
      const data = await getUsers(accessToken!, refreshAccessToken)
      setUsers(data)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken) return
    if(["PRESATATAIRE", "EXECUTANT"].includes(user?.role ?? "")){
      router.back()
    }

    fetchUsers()
  }, [accessToken, user])



  if (loading) return <p className="text-sm text-gray-500">Chargement...</p>

  if (error) return <p className="text-sm text-red-500">{error}</p>

  if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    return <p className="text-sm text-gray-500">Accès refusé</p>
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Utilisateurs</h1>

        <Button
          onClick={() => router.push("/users/create")}
          className="h-10 px-4 text-sm cursor-pointer"
        >
          + Ajouter
        </Button>
      </div>

      {/* TABLE */}
      <DataTable columns={userColumns(fetchUsers)} data={users} />

      <div className="text-sm text-gray-500">
        {users.length} utilisateurs
      </div>

    </div>
  )
}


// "use client"

// import { useEffect, useState } from "react"
// import { DataTable } from "@/components/tables/data-table"
// import { userColumns } from "@/features/users/users-columns"
// import { User } from "@/types/database"
// import { useAuth } from "@/features/auth/auth-provider"
// import { getUsers } from "@/features/users/users.service"

// export default function UsersPage() {
//   const { accessToken, user } = useAuth()
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     if (!accessToken) return

//     async function fetchUsers() {
//       try {
//         setLoading(true)
//         const data = await getUsers(accessToken as string)
//         setUsers(data)
//       } catch (err) {
//         if(err instanceof Error)
//          setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUsers()
//   }, [accessToken])

//   if (loading) {
//     return <p className="text-sm text-gray-500">Chargement utilisateurs...</p>
//   }

//   if (error) {
//     return <p className="text-sm text-red-500">{error}</p>
//   }

//   if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
//     return (
//       <p className="text-sm text-gray-500">
//         Access Refusé
//       </p>
//     )
//   }

//   return (
//     <div className="space-y-6">
      
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold tracking-tight">
//           Utilisateurs
//         </h1>
//       </div>

//       {/* TABLE */}
//       <DataTable
//         columns={userColumns}
//         data={users}
//       />

//       <div className="text-sm text-gray-500">
//         {users.length} utilisateurs
//       </div>
      
//     </div>
//   )
// }

// "use client";

// import { DataTable } from "@/components/tables/data-table"
// import { userColumns } from "@/features/users/users-columns"
// import { User } from "@/types/database"

// const users: User[] = [

//   {
//     id: "1",
//     name: "Admin",
//     email: "admin@email.com",
//     phone: "12345678",
//     role: "ADMIN",
//     active: true,
//     createdAt: "",
//     updatedAt: ""
//   },

//   {
//     id: "2",
//     name: "Jean Manager",
//     email: "manager@email.com",
//     role: "MANAGER",
//     active: true,
//     createdAt: "",
//     updatedAt: ""
//   },

//   {
//     id: "3",
//     name: "Marc Dev",
//     email: "dev@email.com",
//     role: "EXECUTANT",
//     active: true,
//     createdAt: "",
//     updatedAt: ""
//   }

// ]

// export default function UsersPage() {

//   return (

//     <div className="space-y-4">

//       <h1 className="text-xl font-semibold">
//         Users
//       </h1>

//       <DataTable
//         columns={userColumns}
//         data={users}
//       />

//     </div>

//   )
// }
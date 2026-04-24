"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/tables/data-table"
import { freelancerColumns } from "@/features/freelancers/freelancers-columns"
import { Freelancer } from "@/types/database"
import { getFreelancers } from "@/features/freelancers/freelancer.service"
import { useAuth } from "@/features/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const { accessToken, user } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (!accessToken) return

    if(["PRESATATAIRE", "EXECUTANT"].includes(user?.role ?? "")){
      router.back()
    }

    getFreelancers(accessToken).then(setFreelancers)
  }, [accessToken, user, search, status])

  async function fetchFreelancers() {
    const data = await getFreelancers(accessToken as string, { search, status })
    setFreelancers(data)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h1 className="text-xl font-semibold">
          Prestataires
        </h1>

        <Button className="cursor-pointer" onClick={() => router.push("/freelancers/create")}>
          + Ajouter
        </Button>
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
        </select>

      </div>

      <DataTable columns={freelancerColumns(fetchFreelancers)} data={freelancers} />
    </div>
  )
}



// import { DataTable } from "@/components/tables/data-table"
// import { freelancerColumns } from "@/features/freelancers/freelancers-columns"
// import { Freelancer } from "@/types/database"

// const freelancers: Freelancer[] = [

//   {
//     id: "1",
//     name: "Marketing Agency",
//     email: "agency@email.com",
//     phone: "12345678",
//     specialty: "Digital Marketing",
//     status: "ACTIVE",
//     createdAt: new Date().toISOString()
//   }

// ]

// export default function FreelancersPage() {

//   return (

//     <div className="space-y-4">

//       <h1 className="text-xl font-semibold">
//         Freelancers
//       </h1>

//       <DataTable
//         columns={freelancerColumns}
//         data={freelancers}
//       />

//     </div>

//   )
// }
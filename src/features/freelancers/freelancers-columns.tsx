"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Freelancer } from "@/types/database"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { deleteFreelancer } from "@/features/freelancers/freelancer.service"
import { useEffect } from "react"

function FreelancerActions({ refresh, freelancer }: { refresh: () => void, freelancer: Freelancer }) {
  const router = useRouter()
  const { accessToken } = useAuth()

  useEffect(() => {
    refresh()
  }, [])

  async function handleDelete() {
    if (!accessToken) return

    await deleteFreelancer(freelancer.id, accessToken)

    // refresh simple
    refresh()
  }

  return (
    <div className="flex gap-2">
      <Button
        className="text-sm cursor-pointer"
        onClick={() => router.push(`/freelancers/${freelancer.id}`)}
      >
        Voir
      </Button>

      <Button
        variant="outline"
        className="text-sm cursor-pointer"
        onClick={() => router.push(`/freelancers/${freelancer.id}/edit`)}
      >
        Modifier
      </Button>

      <Button
        className="text-sm cursor-pointer"
        onClick={handleDelete}
      >
        Supprimer
      </Button>
    </div>
  )
}

export const freelancerColumns = (
  refresh: () => void
): ColumnDef<Freelancer>[] => [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Téléphone" },
  { accessorKey: "specialty", header: "Spécialité" },
  { accessorKey: "status", header: "Statut" },

  {
    id: "actions",
    cell: ({ row }) => (
      <FreelancerActions refresh={refresh} freelancer={row.original} />
    ),
  },
]




// "use client";

// import { ColumnDef } from "@tanstack/react-table"
// import { Freelancer } from "@/types/database"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"

// function FreelancerActions({ freelancer }: { freelancer: Freelancer}){
//   const router = useRouter()

//   return (
//     <div className="flex gap-2">
//       <Button
//         className="text-sm cursor-pointer"
//         onClick={() =>
//           router.push(`/freelancers/${freelancer.id}`)
//         }
//       >
//         Voir
//       </Button>

//       <Button
//         className="text-sm cursor-pointer"
//         variant="outline"
//         onClick={() =>
//           router.push(`/freelancers/${freelancer.id}/edit`)
//         }
//       >
//         Modifier
//       </Button>
//     </div>
//   )
// }

// export const freelancerColumns: ColumnDef<Freelancer>[] = [
//   { accessorKey: "name", header: "Nom" },
//   { accessorKey: "email", header: "Email" },
//   { accessorKey: "phone", header: "Telephone" },
//   { accessorKey: "specialty", header: "Spécialité" },
//   { accessorKey: "status", header: "Status" },

//   {
//     id: "actions",
//     cell: ({ row }) => <FreelancerActions freelancer={row.original} />
//   },
// ]


// import { ColumnDef } from "@tanstack/react-table"
// import { Freelancer } from "@/types/database"

// export const freelancerColumns: ColumnDef<Freelancer>[] = [

//   {
//     accessorKey: "name",
//     header: "Name"
//   },

//   {
//     accessorKey: "email",
//     header: "Email"
//   },

//   {
//     accessorKey: "phone",
//     header: "Phone"
//   },

//   {
//     accessorKey: "specialty",
//     header: "Specialty"
//   },

//   {
//     accessorKey: "status",
//     header: "Status"
//   }

// ]
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client } from "@/types/database"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { deleteClient } from "./clients.service"
import { useEffect } from "react"

function ClientActions({
  client,
  refresh,
}: {
  client: Client
  refresh: () => void
}) {
  const router = useRouter()
  const { accessToken } = useAuth()

  useEffect(() => {
    refresh()
  }, [])
  
  async function handleDelete() {
    await deleteClient(client.id, accessToken!)
    refresh()
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => router.push(`/clients/${client.id}/edit`)}
        className="h-9 text-sm cursor-pointer"
      >
        Edit
      </Button>

      <Button
        variant="outline"
        onClick={handleDelete}
        className="h-9 text-sm cursor-pointer"
      >
        Supprimer
      </Button>
    </div>
  )
}

export const columns = (
  refresh: () => void
): ColumnDef<Client>[] => [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Téléphone" },
  { accessorKey: "status", header: "Statut" },

  {
    id: "actions",
    cell: ({ row }) => (
      <ClientActions
        client={row.original}
        refresh={refresh}
      />
    ),
  },
]

// import { ColumnDef } from "@tanstack/react-table"
// import { Client } from "@/types/database"

// export const columns: ColumnDef<Client>[] = [
//   {
//     accessorKey: "name",
//     header: "Name"
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     cell: ({ row }) => row.original.email ?? "-"
//   },
//   {
//     accessorKey: "phone",
//     header: "Phone",
//     cell: ({ row }) => row.original.phone ?? "-"
//   },
//   {
//     accessorKey: "status",
//     header: "Status"
//   }
// ]




// import { ColumnDef } from "@tanstack/react-table"
// import { Client } from "@/types/database"

// export const columns: ColumnDef<Client>[] = [

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
//     accessorKey: "status",
//     header: "Status"
//   }

// ]
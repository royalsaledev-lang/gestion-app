"use client";

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/database"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { useToast } from "../auth/ToastContext";

function UserActions({ user, refresh }: { user: User, refresh: () => void }) {
  const router = useRouter()
  const { accessToken } = useAuth()
  const { showToast } = useToast()
  
  async function handleDeactivate() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/deactivate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if(!res.ok) throw Error("Error")

      showToast(
        user.active ? "Utilisateur désactivé" : "Utilisateur activé",
        "success"
      )
      refresh()
    } catch (error) {
      console.log(error);
    }
  }

  if (user.role === "ADMIN") return null

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="cursor-pointer h-9 text-sm"
        onClick={() => router.push(`/users/${user.id}/edit`)}
      >
        Edit
      </Button>

      <Button
        variant="outline"
        className="cursor-pointer h-9 text-sm"
        onClick={handleDeactivate}
      >
        { user.active ? "Activé" : "Désactiver"}
      </Button>
    </div>
  )
}

export const userColumns = (refresh: () => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rôle",
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.active ? "Actif" : "Inactif"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActions user={row.original} refresh={refresh} />,
  },
]

// "use client";

// import { ColumnDef } from "@tanstack/react-table"
// import { User } from "@/types/database"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"

// export const userColumns: ColumnDef<User>[] = [
//   {
//     accessorKey: "name",
//     header: "Nom",
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "role",
//     header: "Rôle",
//   },
//   {
//     accessorKey: "active",
//     header: "Statut",
//     cell: ({ row }) => (
//       <span>
//         {row.original.active ? "Actif" : "Inactif"}
//       </span>
//     ),
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const user = row.original

//       return (
//         <div className="flex gap-2">
//           {
//             user.role !== "ADMIN" && (
//               <>
//                 <Button
//                   // size="sm"
//                   variant="outline"
//                   onClick={() => useRouter().push(`/users/${user.id}`)}
//                   className="cursor-pointer"
//                 >
//                   Edit
//                 </Button>

//                 <Button
//                   // size="sm"
//                   variant="outline"
//                   onClick={async () => {
//                     await fetch(`/users/${user.id}/deactivate`, {
//                       method: "PATCH",
//                     })
//                     useRouter().refresh()
//                   }}
//                   className="cursor-pointer"
//                 >
//                   Désactiver
//                 </Button>
//               </>
//             )
//           }
//         </div>
//       )
//     },
//   },
// ]


// import { ColumnDef } from "@tanstack/react-table"
// import { User } from "@/types/database"
// import { UserRoleBadge } from "./user-role-badge"

// export const userColumns: ColumnDef<User>[] = [

//   {
//     accessorKey: "name",
//     header: "Name"
//   },

//   {
//     accessorKey: "email",
//     header: "Email"
//   },

//   {
//     accessorKey: "role",
//     header: "Role",
//     cell: ({ row }) => (
//       <UserRoleBadge role={row.original.role} />
//     )
//   },

//   {
//     accessorKey: "active",
//     header: "Active"
//   }

// ]
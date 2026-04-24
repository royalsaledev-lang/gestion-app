"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserLite } from "@/types/database"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { removeMember } from "./member.service"
import { useAuth } from "../auth/auth-provider"

const MembersActions = ({refresh, members}: {refresh: () => void, members: UserLite}) => {
      const member = members
      const { user, accessToken } = useAuth()

      async function handleDelete() {
        await removeMember(member.id, accessToken as string)
        refresh()
      }

      return (
        <div className="flex gap-2">

          <Link href={`/members/${member.id}`}>
            <Button className="text-sm cursor-pointer">Voir</Button>
          </Link>

          {user?.role === "MANAGER"  || user?.role === "PRESTATAIRE" && (
            <>
              <Link href={`/members/${member.id}/edit`}>
                <Button variant="outline" className="text-sm cursor-pointer">
                  Modifier
                </Button>
              </Link>

              <Button
                className="text-sm cursor-pointer"
                onClick={handleDelete}
              >
                Supprimer
              </Button>
            </>
          )}
        </div>
      )
    }

export const memberColumns = (refresh: () => void): ColumnDef<UserLite>[] => [

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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
        <MembersActions refresh={refresh} members={row.original} />
    ),
  },
]
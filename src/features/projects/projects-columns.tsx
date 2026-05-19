"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Project } from "@/types/database"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "../auth/auth-provider"
import { useEffect } from "react"


const ProjectActions = ({project, refresh}: {project: Project, refresh: () => void}) => {
  const { user } = useAuth()

  useEffect(() => {
    if(!user) return;

    refresh()
  }, [])

  return (
      <div className="flex gap-2">

        <Link href={`/projects/${project.id}`}>
          <Button className="text-sm cursor-pointer">Voir</Button>
        </Link>

        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (<Link href={`/projects/${project.id}/edit`}>
          <Button variant="outline" className="text-sm cursor-pointer">
            Modifier
          </Button>
        </Link>)}

      </div>
    )
}




export const projectColumns = (refresh: () => void): ColumnDef<Project>[] => [

  {
    accessorKey: "name",
    header: "Nom du projet"
  },

  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => row.original.manager?.name ?? "-"
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => row.original.client?.name ?? "-"
  },

  {
    accessorKey: "status",
    header: "Status"
  },

  {
    accessorKey: "priority",
    header: "Priorité"
  },

  {
    accessorKey: "deadline",
    header: "Date de fin",
    cell: ({ row }) => {
      const value = row.original.deadline

      if (!value) return "-"

      const date = new Date(value)

      if (isNaN(date.getTime())) return "-"

      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ProjectActions refresh={refresh} project={row.original}/>
    )
  }

]


// import { ColumnDef } from "@tanstack/react-table"
// import { Project } from "@/types/database"

// export const projectColumns: ColumnDef<Project>[] = [

//   {
//     accessorKey: "name",
//     header: "Nom du projet"
//   },

//   {
//     accessorKey: "status",
//     header: "Status"
//   },

//   {
//     accessorKey: "priority",
//     header: "Priorité"
//   },

//   {
//     accessorKey: "deadline",
//     header: "Date de fin",
//     cell: ({ row }) =>
//       row.original.deadline ?? "-"
//   }

// ]
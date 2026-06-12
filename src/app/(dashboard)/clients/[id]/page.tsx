"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { useAuth } from "@/features/auth/auth-provider"
import { getClientById } from "@/features/clients/clients.service"

import { Client } from "@/types/database"

export default function ClientDetailsPage() {
  const { id } = useParams()

  const { accessToken } = useAuth()

  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    if (!accessToken || !id) return

    getClientById(
      id as string,
      accessToken
    ).then(setClient)
  }, [id, accessToken])

  if (!client) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {client.name}
        </h1>

        <p>{client.email}</p>
        <p>{client.phone}</p>
        <p>{client.company}</p>
        <p>{client.status}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Projets ({client.projects?.length || 0})
        </h2>

        <div className="space-y-3">
          {client.projects?.map((project) => (
            <div
              key={project.id}
              className="border rounded p-3"
            >
              <h3 className="font-medium">
                {project.name}
              </h3>

              <p className="text-sm text-gray-500">
                {project.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreateProjectDTO } from "@/types/forms"
import { useAuth } from "../auth/auth-provider"
import { getClients } from "../clients/clients.service"
import { getUsers } from "../users/users.service"
import { Client, User } from "@/types/database"
import { isErrorBarRelevantForAxisType } from "recharts/types/state/selectors/axisSelectors"

interface Props {
  loading: boolean
  initialData?: CreateProjectDTO
  onSubmit: (data: CreateProjectDTO) => void
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function ProjectForm({ loading, initialData, onSubmit, setLoading }: Props) {

  const [form, setForm] = useState<CreateProjectDTO>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "MEDIUM",
    status: initialData?.status || "UPCOMING",
    startDate: initialData?.startDate || "",
    deadline: initialData?.deadline || "",
    clientId: initialData?.clientId || "",
    managerId: initialData?.managerId || ""
  })
  const { user, accessToken, refreshAccessToken } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [managers, setManagers] = useState<User[]>([])

  useEffect(() => {
    async function load() {
      const [c, u] = await Promise.all([
        getClients(accessToken as string),
        getUsers(accessToken as string, refreshAccessToken),
      ])

      setClients(c)
      setManagers(u)
    }

    if (accessToken) load()
  }, [accessToken])

  function handleSubmit() {
    try {
      setLoading(true)
      onSubmit({
        ...form,
        managerId: form.managerId || undefined,
        clientId: form.clientId || undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined
      })
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }

  return (
    <>

    <div className="grid grid-cols-2 gap-4">

      {/* Nom */}
      <div className="space-y-1">
        <label className="text-sm">Nom du projet</label>
        <Input
          className="h-11"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm">Description</label>
        <Input
          className="h-11"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* Priorité */}
      <div className="space-y-1">
        <label className="text-sm">Priorité</label>
        <select
          className="w-full h-11 border rounded px-3"
          value={form.priority}
          onChange={(e) =>
            setForm({
              ...form,
              priority: e.target.value as CreateProjectDTO["priority"],
            })
          }
        >
          <option value="LOW">Faible</option>
          <option value="MEDIUM">Moyen</option>
          <option value="HIGH">Élevé</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Statut */}
      <div className="space-y-1">
        <label className="text-sm">Statut</label>
        <select
          className="w-full h-11 border rounded px-3"
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as CreateProjectDTO["status"],
            })
          }
        >
          <option value="UPCOMING">À venir</option>
          <option value="IN_PROGRESS">En cour</option>
          <option value="COMPLETED">Terminé</option>
          <option value="BLOCKED">Bloqué</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      {/* Date début */}
      <div className="space-y-1">
        <label className="text-sm">Date début</label>
        <Input
          type="date"
          className="h-11"
          value={form.startDate || ""}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />
      </div>

      {/* Deadline */}
      <div className="space-y-1">
        <label className="text-sm">Deadline</label>
        <Input
          type="date"
          className="h-11"
          value={form.deadline || ""}
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          }
        />
      </div>

      <div className="space-y-1">
        <label>Client</label>
        <select
          className="w-full h-11 border rounded px-3"
          value={form.clientId}
          onChange={(e) =>
            setForm({ ...form, clientId: e.target.value })
          }
        >
          <option value={""}>Choisir client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label>Manager</label>
        <select
          className="w-full h-11 border rounded px-3"
          value={form.managerId}
          onChange={(e) =>
            setForm({ ...form, managerId: e.target.value })
          }
        >
          <option value="">Moi-même</option>

          {managers.map((u) => (u.role == "MANAGER") && (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

    </div>

    <Button disabled={loading} className="w-full h-11 cursor-pointer" onClick={handleSubmit}>
      { loading ? "Chargement..." : "Enregistrer"}
    </Button>

  </>
  )
}



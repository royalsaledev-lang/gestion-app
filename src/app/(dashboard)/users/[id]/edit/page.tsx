"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UpdateUserForm } from "@/types/user"

export default function EditUserPage() {
  const params = useParams()
  const id = params?.id as string

  const { accessToken, user } = useAuth()

  const [form, setForm] = useState<UpdateUserForm>({
    name: "",
    email: "",
    role: "EXECUTANT",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!accessToken) return

    if(["PRESATATAIRE", "EXECUTANT"].includes(user?.role ?? "")){
      router.back()
    }

  }, [accessToken, user])

  // 🔥 LOAD USER
  useEffect(() => {
    if (!id) return

    async function fetchUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message)
        }

        setForm({
          name: data.name,
          email: data.email,
          role: data.role,
        })
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, accessToken])

  // 🔥 SUBMIT
  async function submit() {
    try {
      setSaving(true)
      setError("")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      router.push("/users")
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Chargement...</p>
  }

  return (
<div className="flex items-center justify-center min-h-[80vh]">
  <div className="w-[500px] space-y-6">

    <h1 className="text-xl font-semibold">
      Modifier utilisateur
    </h1>

    <div className="grid grid-cols-2 gap-4">

      <div className="space-y-1">
        <label className="text-sm">Nom</label>
        <Input
          className="h-11"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Email</label>
        <Input
          className="h-11"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      </div>

      <div className="col-span-2 space-y-1">
        <label className="text-sm">Rôle</label>
        <select
          className="w-full h-11 border rounded px-3"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value as UpdateUserForm["role"],
            })
          }
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="PRESTATAIRE">PRESTATAIRE</option>
          <option value="EXECUTANT">EXECUTANT</option>
        </select>
      </div>

    </div>

    {error && <p className="text-sm">{error}</p>}

    <Button onClick={submit} className="w-full h-11">
      {saving ? "Mise à jour..." : "Mettre à jour"}
    </Button>

  </div>
</div>    
    // <div className="flex items-center justify-center min-h-[80vh]">
    // <div className="space-y-6 w-[360px]">

    //   <h1 className="text-xl font-semibold tracking-tight">
    //     Modifier utilisateur
    //   </h1>

    //   <div className="space-y-4">

    //     <Input
    //       placeholder="Nom"
    //       value={form.name}
    //       onChange={(e) =>
    //         setForm({ ...form, name: e.target.value })
    //       }
    //       className="h-11 text-base"
    //     />

    //     <Input
    //       placeholder="Email"
    //       value={form.email}
    //       onChange={(e) =>
    //         setForm({ ...form, email: e.target.value })
    //       }
    //       className="h-11 text-base"
    //     />

    //     {/* ROLE SELECT */}
    //     <select
    //       value={form.role}
    //       onChange={(e) =>
    //         setForm({
    //           ...form,
    //           role: e.target.value as UpdateUserForm["role"],
    //         })
    //       }
    //       className="w-full h-11 border rounded-md px-3 text-base bg-white"
    //     >
    //       <option value="ADMIN">ADMIN</option>
    //       <option value="MANAGER">MANAGER</option>
    //       <option value="PRESTATAIRE">PRESTATAIRE</option>
    //       <option value="EXECUTANT">EXECUTANT</option>
    //     </select>

    //     {error && (
    //       <p className="text-sm text-black">
    //         {error}
    //       </p>
    //     )}

    //     <Button
    //       onClick={submit}
    //       className="w-full h-11 text-base font-medium cursor-pointer"
    //       disabled={saving}
    //     >
    //       {saving ? "Mise à jour..." : "Mettre à jour"}
    //     </Button>

    //   </div>

    // </div>
    // </div>
  )
}
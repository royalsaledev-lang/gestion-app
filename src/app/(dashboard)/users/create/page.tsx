"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { UserRole } from "@/types/database"
import { CreateUserForm } from "@/types/forms"

export default function CreateUserPage() {
  const router = useRouter()

  const [form, setForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    role: "EXECUTANT",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, accessToken } = useAuth()

  const availableRoles =
  user?.role === "ADMIN"
    ? ["MANAGER", "PRESTATAIRE", "EXECUTANT"]
    : ["PRESTATAIRE", "EXECUTANT"]

  
  useEffect(() => {
    if (!user) return
    if (!accessToken) return

    if (
      user?.role === "PRESTATAIRE" ||
      user?.role === "EXECUTANT"
    ) {
      router.replace("/")
      return
    }

  }, [accessToken, user])

  async function submit() {
    try {
      setLoading(true)
      setError("")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      router.push("/users")
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
<div className="flex items-center justify-center min-h-[80vh]">
  <div className="w-[500px] space-y-6">

    <h1 className="text-xl font-semibold text-center">
      Créer utilisateur
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
        <label className="text-sm">Mot de passe</label>
        <Input
          type="password"
          className="h-11"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
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
              role: e.target.value as CreateUserForm["role"],
            })
          }
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

    </div>

    {error && <p className="text-sm">{error}</p>}

    <Button onClick={submit} className="w-full h-11">
      {loading ? "Création..." : "Créer"}
    </Button>

  </div>
</div>
  )
}


// "use client"

// import { useState } from "react"
// import { useAuth } from "@/features/auth/auth-provider"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export default function CreateUserPage() {
//   const { accessToken } = useAuth()

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "EXECUTANT",
//   })

//   async function submit() {
//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(form),
//     })

//     window.location.href = "/dashboard/users"
//   }

//   return (
//     <div className="space-y-4 max-w-md">

//       <h1 className="text-xl font-semibold">Créer utilisateur</h1>

//       <Input placeholder="Nom"
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//       />

//       <Input placeholder="Email"
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       />

//       <Input placeholder="Password"
//         type="password"
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//       />

//       <select
//         className="border p-2 rounded"
//         onChange={(e) => setForm({ ...form, role: e.target.value })}
//       >
//         <option value="EXECUTANT">EXECUTANT</option>
//         <option value="PRESTATAIRE">PRESTATAIRE</option>
//         <option value="MANAGER">MANAGER</option>
//       </select>

//       <Button onClick={submit}>Créer</Button>

//     </div>
//   )
// }
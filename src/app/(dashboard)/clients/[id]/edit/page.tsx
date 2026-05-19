"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  updateClient,
  getClientById
} from "@/features/clients/clients.service"
import { ClientStatus } from "@/types/database"

type ClientForm = {
  name: string
  email: string
  phone: string
  company: string
  status: ClientStatus
}

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [form, setForm] = useState<ClientForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "ACTIVE",
  })

  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!accessToken) return

    async function load() {
      const client = await getClientById(id, accessToken as string)

      setForm({
        name: client.name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        company: client.company ?? "",
        status: client.status,
      })

      setLoading(false)
    }

    load()
  }, [id, accessToken])

  async function submit() {
    try {
        setLoading(true)
        await updateClient(id, form, accessToken!)
        router.push("/clients")
    } catch (error) {
        console.log(error);
    } finally {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
<div className="flex justify-center items-center min-h-screen">
  <div className="w-[500px] space-y-6">

    <h1 className="text-xl font-semibold">
      Modifier client
    </h1>

    <div className="grid grid-cols-2 gap-4">

      <div className="space-y-1">
        <label className="text-sm">Nom</label>
        <Input
          className="h-11"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Email</label>
        <Input
          className="h-11"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Téléphone</label>
        <Input
          className="h-11"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Entreprise</label>
        <Input
          className="h-11"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      {/* FULL WIDTH */}
      <div className="col-span-2 space-y-1">
        <label className="text-sm">Statut</label>
        <select
          className="w-full h-11 border rounded px-3 text-sm"
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as ClientStatus,
            })
          }
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="TO_FOLLOW">À suivre</option>
          <option value="ISSUE">Problème</option>
        </select>
      </div>

    </div>

    <Button onClick={submit} className="w-full h-11 cursor-pointer">
      Mettre à jour
    </Button>

  </div>
</div>
    // <div className="flex justify-center items-center min-h-screen">
    //   <div className="space-y-5 w-[350px]">

    //     <h1 className="text-xl font-semibold">
    //       Modifier client
    //     </h1>

    //     <Input
    //       value={form.name}
    //       onChange={(e) =>
    //         setForm({ ...form, name: e.target.value })
    //       }
    //     />

    //     <Input
    //       value={form.email}
    //       onChange={(e) =>
    //         setForm({ ...form, email: e.target.value })
    //       }
    //     />

    //     <Input
    //       value={form.phone}
    //       onChange={(e) =>
    //         setForm({ ...form, phone: e.target.value })
    //       }
    //     />

    //     <Input
    //       value={form.company}
    //       onChange={(e) =>
    //         setForm({ ...form, company: e.target.value })
    //       }
    //     />

    //     <select
    //       className="border h-11 px-3 rounded text-sm"
    //       value={form.status}
    //       onChange={(e) =>
    //         setForm({
    //           ...form,
    //           status: e.target.value as ClientStatus,
    //         })
    //       }
    //     >
    //         <option value="">Tous</option>
    //         <option value="ACTIVE">Active</option>
    //         <option value="INACTIVE">Inactive</option>
    //         <option value="IN_PROGRESS">En cours</option>
    //         <option value="TO_FOLLOW">À suivre</option>
    //         <option value="ISSUE">Problème</option>
    //     </select>

    //     <Button className="w-full h-11" onClick={submit}>
    //       Mettre à jour
    //     </Button>

    //   </div>
    // </div>
  )
}


// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "@/features/auth/auth-provider"
// import { useParams } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { updateClient } from "@/features/clients/clients.service"

// type ClientForm = {
//   name: string
//   email: string
//   phone: string
//   company: string
//   status: "ACTIVE" | "INACTIVE"
// }

// export default function EditClientPage() {
//   const { id } = useParams<{ id: string }>()
//   const { accessToken } = useAuth()

//   const [form, setForm] = useState<ClientForm>({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     status: "ACTIVE",
//   })

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`)
//       .then(res => res.json())
//       .then((data) => {
//         const client = data.find((c: any) => c.id === id)
//         if (client) setForm(client)
//       })
//   }, [id])

//   async function submit() {
//     await updateClient(id, form, accessToken!)
//     window.location.href = "/dashboard/clients"
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="space-y-5 w-[350px]">

//         <h1 className="text-xl font-semibold">
//           Modifier client
//         </h1>

//         <Input value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />

//         <Input value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <Button className="w-full" onClick={submit}>
//           Mettre à jour
//         </Button>

//       </div>
//     </div>
//   )
// }
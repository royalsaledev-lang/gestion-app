"use client"

import { useState } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { createClient, CreateClientInput } from "@/features/clients/clients.service"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CreateClientPage() {
  const { accessToken } = useAuth()
  const [loading,setLoading] = useState(false)

  const [form, setForm] = useState<CreateClientInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "ACTIVE",
  })
  const router = useRouter()

  async function submit() {
    try {
        setLoading(true)
        await createClient(form, accessToken!)
        router.push("/clients")
    } catch (error) {
        console.log(error);
    } finally {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }
  }

  return (
<div className="flex justify-center items-center min-h-screen">
  <div className="w-[500px] space-y-6">

    <h1 className="text-xl font-semibold">
      Créer client
    </h1>

    <div className="grid grid-cols-2 gap-4">

      <div className="space-y-1">
        <label className="text-sm">Nom</label>
        <Input
          className="h-11"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Email</label>
        <Input
          className="h-11"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Téléphone</label>
        <Input
          className="h-11"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm">Entreprise</label>
        <Input
          className="h-11"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

    </div>

    <Button className="w-full h-11 cursor-pointer" onClick={submit}>
      {loading ? "Création en cours..." : "Créer"}
    </Button>

  </div>
</div>
    // <div className="flex justify-center items-center min-h-screen">
    //   <div className="space-y-5 w-[350px]">

    //     <h1 className="text-xl font-semibold">
    //       Créer client
    //     </h1>

    //     <Input placeholder="Nom"
    //       onChange={(e) => setForm({ ...form, name: e.target.value })}
    //     />

    //     <Input placeholder="Email"
    //       onChange={(e) => setForm({ ...form, email: e.target.value })}
    //     />

    //     <Input placeholder="Téléphone"
    //       onChange={(e) => setForm({ ...form, phone: e.target.value })}
    //     />

    //     <Input placeholder="Entreprise"
    //       onChange={(e) => setForm({ ...form, company: e.target.value })}
    //     />

    //     <Button className="w-full" onClick={submit}>
    //       {loading ? "Création en cour..." : "Créer"}
    //     </Button>

    //   </div>
    // </div>
  )
}
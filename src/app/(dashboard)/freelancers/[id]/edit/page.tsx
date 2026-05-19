"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { FreelancerForm } from "@/features/freelancers/freelancer-form"
import { getFreelancer, updateFreelancer } from "@/features/freelancers/freelancer.service"
import { CreateFreelancerDTO } from "@/types/forms"

export default function EditFreelancerPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken, user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<CreateFreelancerDTO | null>(null)

  useEffect(() => {
    if (!accessToken) return

    if(["PRESATATAIRE", "EXECUTANT"].includes(user?.role ?? "")){
      router.back()
    }

    getFreelancer(id, accessToken).then((data) => {
      setForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        status: data.status,
      })
    })
  }, [id, accessToken, user])

  async function handleSubmit(data: CreateFreelancerDTO) {
    if (!accessToken) return

    await updateFreelancer(id, data, accessToken)
    router.push("/freelancers")
  }

  if (!form) return <p>Loading...</p>

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-[500px] space-y-6">
        <h1 className="text-xl font-semibold">Modifier freelancer</h1>

        <FreelancerForm loading={loading} setLoading={setLoading} initialData={form} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}





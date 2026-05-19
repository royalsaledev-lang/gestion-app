"use client"

import { useRouter } from "next/navigation"
import { FreelancerForm } from "@/features/freelancers/freelancer-form"
import { useAuth } from "@/features/auth/auth-provider"
import { CreateFreelancerDTO } from "@/types/forms"
import { createFreelancer } from "@/features/freelancers/freelancer.service"
import { useEffect, useState } from "react"

export default function CreateFreelancerPage() {
  const router = useRouter()
  const { accessToken, user } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!accessToken) return

    if(["PRESATATAIRE", "EXECUTANT"].includes(user?.role ?? "")){
      router.back()
    }

  }, [accessToken, user])

  async function handleSubmit(data: CreateFreelancerDTO) {
    if (!accessToken) return
    await createFreelancer(data, accessToken)
    router.push("/freelancers")
  }

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-[500px] space-y-6">
        <h1 className="text-xl font-semibold">Créer freelancer</h1>

        <FreelancerForm loading={loading} onSubmit={handleSubmit} setLoading={setLoading} />
      </div>
    </div>
  )
}



"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { MemberForm } from "@/features/members/member-form"
import { addMember } from "@/features/members/member.service"
import { useState } from "react"
import { CreateMemberDTO } from "@/types/forms"

export default function CreateMemberPage() {
  const router = useRouter()
  const { accessToken, user } = useAuth()
  const [loading, setLoading] = useState(false)

  console.log(user);
  

  async function handleCreate(data: CreateMemberDTO) {
    if (!accessToken || !user?.freelancerId) return

    await addMember(user.freelancerId, data, accessToken)
    
    router.push("/members")
  }

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-[400px] space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Ajouter membre
        </h1>

        <MemberForm onSubmit={handleCreate} loading={loading} setLoading={setLoading} />
      </div>
    </div>
  )
}
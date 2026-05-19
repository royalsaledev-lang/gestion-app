"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { MemberForm } from "@/features/members/member-form"
import { getFreelancerMembers, getMember, updateMember } from "@/features/members/member.service"
import { useEffect, useState } from "react"
import { CreateMemberDTO } from "@/types/forms"
import { UserLite } from "@/types/database"

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken, user } = useAuth()

  const [member, setMember] = useState<CreateMemberDTO | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!accessToken || !user?.freelancerId || !id) return

    getMember(id, accessToken).then(setMember)

  }, [id, accessToken, user])

  async function handleUpdate(data: CreateMemberDTO) {
    if (!accessToken) return

    setLoading(true)

    await updateMember(id, data, accessToken)

    router.push("/members")
  }

  if (!member) return <p>Loading...</p>

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-[400px] space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Modifier membre
        </h1>

        <MemberForm
          onSubmit={handleUpdate}
          loading={loading}
          setLoading={setLoading}
          member={member}
        />
      </div>
    </div>
  )
}
"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { useEffect, useState } from "react"
import { UserLite } from "@/types/database"
import { getMember } from "@/features/members/member.service"

export default function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken, user } = useAuth()

  const [member, setMember] = useState<UserLite | null>(null)

  useEffect(() => {
    if (!accessToken || !user?.freelancerId || !id) return

    getMember(id, accessToken as string).then(setMember)
  }, [id, accessToken, user])

  if (!member) return <p>Loading...</p>

  return (
    <div className="space-y-4 border p-4 rounded">
      <h1 className="text-xl font-semibold">{member.name}</h1>
      <p>Email: {member.email}</p>
      <p>Role: {member.role}</p>
    </div>
  )
}
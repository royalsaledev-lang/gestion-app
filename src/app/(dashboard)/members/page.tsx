"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/tables/data-table"
import { Button } from "@/components/ui/button"
import { getFreelancerMembers } from "@/features/members/member.service"
import { User, UserLite } from "@/types/database"
import { memberColumns } from "@/features/members/members-columns"

export default function MembersPage() {
  const { user, accessToken } = useAuth()
  const router = useRouter()

  const [members, setMembers] = useState<UserLite[]>([])

    useEffect(() => {
    if (!accessToken || !user?.freelancerId) return

    getFreelancerMembers(user.freelancerId, accessToken).then((data) => {
        const executants = data.filter((m: User) => m.role === "EXECUTANT")
        setMembers(executants)
    })
    }, [accessToken, user?.freelancerId])

    function refresh() {
      if (!accessToken || !user?.freelancerId) return

      getFreelancerMembers(user.freelancerId, accessToken).then((data) => {
          const executants = data.filter((m: User) => m.role === "EXECUTANT")
          setMembers(executants)
      })
    }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Members</h1>

        {user?.role === "PRESTATAIRE" && (
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/members/create")}
          >
            + Ajouter
          </Button>
        )}
      </div>

      <DataTable columns={memberColumns(refresh)} data={members} />

    </div>
  )
}
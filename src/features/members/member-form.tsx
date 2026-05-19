"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserLite, UserRole } from "@/types/database"
import { CreateMemberDTO } from "@/types/forms"

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (data: CreateMemberDTO) => void
  loading: boolean
  member?: CreateMemberDTO
}

export function MemberForm({ onSubmit, loading, setLoading, member }: Props) {
  const [data, setData] = useState({
    name: member?.name ?? "",
    email: member?.email ?? "",
  })
  const [role, setRole] = useState<UserRole>("EXECUTANT")

  
  function handleSubmit(form: CreateMemberDTO) {
    try {
      setLoading(true)
      onSubmit(form)
    } catch (error) {
        console.log(error)
    } finally {
      setTimeout(() => {
          setLoading(false)
      }, 2000);
    }
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Nom"
        value={data.name}
        onChange={(e) => setData({
          ...data,
          name: e.target.value
        })}
      />

      <Input
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({
          ...data,
          email: e.target.value
        })}
      />

      <Input
        placeholder="Rôle"
        value={role}
        onChange={(e) => setRole(e.target.value as CreateMemberDTO["role"])}
      />

      <Button
        disabled={loading}
        onClick={() => handleSubmit({ name: data.name, email: data.email, role })}
        className="w-full cursor-pointer"
      >
        { loading ? "Chargement..." : "Enregistrer"}
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/auth-provider"
import { useToast } from "./ToastContext"

export default function ResetPasswordForm() {
  const { resetPassword } = useAuth()

  const params = useSearchParams()
  const token = params.get("token") || ""
  const { showToast } = useToast()

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function submit() {
    if(!password){
        showToast("Mot de passe requis", "info")
    }
    try {
      setLoading(true)
      await resetPassword(token, password)
      setDone(true)
      setPassword("")
      router.push("/")
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }

  return (
    <div className="w-[360px] space-y-5">

      <h1 className="text-2xl text-center font-semibold">
        Nouveau mot de passe
      </h1>

      <Input
        type="password"
        placeholder="Nouveau"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-11 text-base"
      />

      {/* {done && (
        <p className="text-green-600 text-sm">
          Mot de passe mise à jour avec succèss
        </p>
      )} */}

      <Button
        onClick={submit}
        disabled={loading}
        className="w-full h-11 text-base font-medium cursor-pointer"
      >
        {loading ? "Mise a jour en cour..." : "Mettre à jour"}
      </Button>

    </div>
  )
}
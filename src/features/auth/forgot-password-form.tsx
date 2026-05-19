"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/auth-provider"
import Link from "next/link"
import { useToast } from "./ToastContext"

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { showToast } = useToast()

  async function submit() {
    if(!email){
        showToast("Email obligatoire", "info")
        return;
    }

    try {
      setLoading(true)
      await forgotPassword(email)
      setMessage("Vérifie ton mail.")
      setEmail("")
    } catch(error) {
        console.log(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[360px] space-y-5">

      <h1 className="text-2xl text-center font-semibold">
        Réinitialiser mot de passe
      </h1>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 text-base"
      />

      {/* {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )} */}

      <Button
        onClick={submit}
        disabled={loading}
        className="w-full h-11 text-base font-medium cursor-pointer"
      >
        {loading ? "Envoie..." : "Envoyer le lien"}
      </Button>

      
      <div className="flex justify-end">
        <Link
            href={'/'}
            className="text-sm text-gray-500 hover:text-black transition"
        >
            Retour a la connexion
        </Link>
      </div>

    </div>
  )
}
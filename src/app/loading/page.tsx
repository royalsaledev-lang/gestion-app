"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoadingPage() {
  const { accessToken } = useAuth()
    const router = useRouter()

  useEffect(() => {
    if(accessToken){
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000);
    }
    if(!accessToken){
      setTimeout(() => {
        router.push('/')
      }, 3000);
    }
  }, [accessToken]);

    return (
      <div className="flex items-center justify-center h-screen">
        Chargement...
      </div>
    )
}
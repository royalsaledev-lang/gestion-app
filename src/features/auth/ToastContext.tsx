"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback
} from "react"
import ToastItem from "./ToastItem"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {

  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "info") => {

    const id = Date.now()

    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)

  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>

      {children}

      {/* TOAST UI */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">

        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}

      </div>

    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast doit être utilisé dans ToastProvider")
  return ctx
}

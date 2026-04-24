import { ReactNode } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[500px]">

        {children}

      </div>

    </div>
  )
}
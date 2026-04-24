import { ReactNode } from "react"

export function Workspace({ children }: { children: ReactNode }) {

  return (
    <div className="p-6">
      {children}
    </div>
  )
}
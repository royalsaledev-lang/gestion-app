import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: number | string
  icon?: ReactNode
}

export function StatCard({ title, value, icon }: StatCardProps) {

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h3 className="text-2xl font-semibold">
          {value}
        </h3>

      </div>

      <div className="text-gray-400">
        {icon}
      </div>

    </div>
  )
}
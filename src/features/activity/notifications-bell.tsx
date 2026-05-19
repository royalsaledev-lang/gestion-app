"use client"

import { Bell } from "lucide-react"

interface Props {
  count: number
}

export function NotificationsBell({ count }: Props) {

  return (

    <div className="relative cursor-pointer">

      <Bell size={20} />

      {count > 0 && (

        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">

          {count}

        </span>

      )}

    </div>

  )
}
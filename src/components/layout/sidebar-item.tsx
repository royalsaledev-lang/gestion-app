"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

interface Props {
  label: string
  href: string
}

export function SidebarItem({ label, href }: Props) {

  const pathname = usePathname()

  const active = pathname === href

  return (
    <Link
      href={href}
      className={clsx(
        "px-3 py-2 rounded-lg text-sm font-medium",
        "hover:bg-gray-100",
        active && "bg-gray-100"
      )}
    >
      {label}
    </Link>
  )
}
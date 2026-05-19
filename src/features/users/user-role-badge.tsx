import { UserRole } from "@/types/database"

interface Props {
  role: UserRole
}

export function UserRoleBadge({ role }: Props) {

  const colors: Record<UserRole, string> = {

    ADMIN: "bg-red-100 text-red-700",

    MANAGER: "bg-blue-100 text-blue-700",

    EXECUTANT: "bg-green-100 text-green-700",

    PRESTATAIRE: "bg-purple-100 text-purple-700"

  }

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[role]}`}>
      {role}
    </span>
  )
}
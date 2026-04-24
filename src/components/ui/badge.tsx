import clsx from "clsx"

interface BadgeProps {
  label: string
  color?: "gray" | "green" | "red" | "yellow" | "blue"
}

export function Badge({ label, color = "gray" }: BadgeProps) {

  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700"
  }

  return (
    <span className={clsx("px-2 py-1 text-xs rounded-md", colors[color])}>
      {label}
    </span>
  )
}
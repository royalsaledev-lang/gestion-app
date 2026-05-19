interface AvatarProps {
  name: string
}

export function Avatar({ name }: AvatarProps) {

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")

  return (
    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">
      {initials}
    </div>
  )
}
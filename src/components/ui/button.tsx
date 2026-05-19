import { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {

  const styles = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-black hover:bg-gray-200",
    outline: "border border-gray-300 text-black hover:bg-gray-100"
  }

  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition",
        styles[variant],
        className
      )}
      {...props}
    />
  )
}
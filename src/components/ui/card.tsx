import { cn } from "@/lib/utils/cn"
import * as React from "react"

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {

  return (
    <div
      className={cn(
        "rounded-xl border bg-white text-black shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export function CardContent({ className, ...props }: CardContentProps) {

  return (
    <div
      className={cn(
        "p-6",
        className
      )}
      {...props}
    />
  )
}
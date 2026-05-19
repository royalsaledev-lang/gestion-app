import { PaymentStatus } from "@/types/database"

interface Props {
  status: PaymentStatus
}

export function PaymentStatusBadge({ status }: Props) {

  const colors: Record<PaymentStatus, string> = {

    NOT_PAID: "bg-red-100 text-red-700",

    ADVANCE: "bg-yellow-100 text-yellow-700",

    PAID: "bg-green-100 text-green-700"

  }

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
      {status}
    </span>
  )
}
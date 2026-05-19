import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "@/types/database"
import { PaymentStatusBadge } from "./payment-status-badge"

export const paymentColumns: ColumnDef<Payment>[] = [

  {
    accessorKey: "amount",
    header: "Amount"
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <PaymentStatusBadge status={row.original.status} />
    )
  },

  {
    accessorKey: "projectId",
    header: "Project"
  },

  {
    accessorKey: "createdAt",
    header: "Date"
  }

]
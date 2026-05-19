"use client";

import { DataTable } from "@/components/tables/data-table"
import { paymentColumns } from "@/features/payments/payment-columns"
import { Payment } from "@/types/database"

const payments: Payment[] = [

  {
    id: "1",
    amount: 500,
    status: "ADVANCE",
    projectId: "1",
    createdAt: new Date().toISOString()
  },

  {
    id: "2",
    amount: 1200,
    status: "PAID",
    projectId: "1",
    createdAt: new Date().toISOString()
  }

]

export default function PaymentsPage() {

  return (

    <div className="space-y-4">

      <h1 className="text-xl font-semibold">
        Payments
      </h1>

      <DataTable
        columns={paymentColumns}
        data={payments}
      />

    </div>

  )
}
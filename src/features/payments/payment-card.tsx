import { Card, CardContent } from "@/components/ui/card"
import { Payment } from "@/types/database"

interface Props {
  payment: Payment
}

export function PaymentCard({ payment }: Props) {

  return (

    <Card>

      <CardContent>

        <p className="font-medium">
          ${payment.amount}
        </p>

        <p className="text-sm text-gray-500">
          Status: {payment.status}
        </p>

      </CardContent>

    </Card>

  )
}
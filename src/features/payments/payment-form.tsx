"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PaymentFormData {

  amount: number
  projectId: string

}

interface Props {
  onSubmit: (data: PaymentFormData) => void
}

export function PaymentForm({ onSubmit }: Props) {

  const [amount, setAmount] = useState(0)

  const [projectId, setProjectId] = useState("")

  function submit() {

    onSubmit({
      amount,
      projectId
    })

  }

  return (

    <div className="space-y-4">

      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(Number(e.target.value))
        }
      />

      <Input
        placeholder="Project ID"
        value={projectId}
        onChange={(e) =>
          setProjectId(e.target.value)
        }
      />

      <Button onClick={submit}>
        Add Payment
      </Button>

    </div>

  )
}
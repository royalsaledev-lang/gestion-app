"use client"

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface RevenueData {
  month: string
  revenue: number
}

interface Props {
  data: RevenueData[]
}

export function RevenueChart({ data }: Props) {

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      <h3 className="text-sm font-medium mb-4">
        Revenue Overview
      </h3>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <XAxis dataKey="month" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#000"
            strokeWidth={2}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}
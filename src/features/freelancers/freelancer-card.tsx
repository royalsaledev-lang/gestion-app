import { Card, CardContent } from "@/components/ui/card"
import { Freelancer } from "@/types/database"

interface Props {
  freelancer: Freelancer
}

export function FreelancerCard({ freelancer }: Props) {

  return (

    <Card>

      <CardContent className="p-4">

        <h3 className="font-medium">
          {freelancer.name}
        </h3>

        <p className="text-sm text-gray-500">
          {freelancer.specialty}
        </p>

        <p className="text-sm mt-2">
          {freelancer.email}
        </p>

      </CardContent>

    </Card>

  )
}
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/auth-provider"
import { getFreelancer } from "@/features/freelancers/freelancer.service"
import { Project } from "@/types/database"
import { FreelancerMembers } from "@/features/freelancers/freelancer-members"
import { FreelancerProjects } from "@/features/freelancers/freelancer-projects"
import { FreelancerFull } from "@/types/freelancer"

export default function FreelancerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken, user } = useAuth()
  const router = useRouter()

  const [freelancer, setFreelancer] = useState<FreelancerFull | null>(null)

  useEffect(() => {
    if (!accessToken) return

    if(["PRESATATAIRE", "EXECUTANT"].includes(user?.role ?? "")){
      router.back()
    }

    getFreelancer(id, accessToken).then((data) => {
      setFreelancer(data)
    })
  }, [id, accessToken, user])

  const fetchFreelancer = async () => {
    await getFreelancer(id, accessToken as string).then((data) => {
      setFreelancer(data)
    })
  }

  if (!freelancer) return <p>Loading...</p>

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        {freelancer.name}
      </h1>

      <div>
        <h2 className="font-medium mb-2">
          Team Members
        </h2>

        <FreelancerMembers freelancerId={freelancer.id} refresh={fetchFreelancer} members={freelancer.members} />
      </div>

      <div>
        <h2 className="font-medium mb-2">
          Projects
        </h2>

        <FreelancerProjects
          refresh={fetchFreelancer}
          projects={freelancer.projects.map(p => p.project)}
        />
      </div>

    </div>
  )
}












// import { FreelancerMembers } from "@/features/freelancers/freelancer-members"
// import { FreelancerProjects } from "@/features/freelancers/freelancer-projects"

// export default function FreelancerDetailsPage() {

//   return (

//     <div className="space-y-6">

//       <h1 className="text-2xl font-semibold">
//         Freelancer Details
//       </h1>

//       <div>

//         <h2 className="font-medium mb-2">
//           Team Members
//         </h2>

//         <FreelancerMembers members={[]} />

//       </div>

//       <div>

//         <h2 className="font-medium mb-2">
//           Projects
//         </h2>

//         <FreelancerProjects projects={[]} />

//       </div>

//     </div>

//   )
// }
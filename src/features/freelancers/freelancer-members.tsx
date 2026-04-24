"use client"

import { UserLite } from "@/types/database"
import { useAuth } from "@/features/auth/auth-provider"
import { removeMember, addMember } from "@/features/members/member.service"
import { useState } from "react"
import { MemberForm } from "@/features/members/member-form"
import { Button } from "@/components/ui/button"
import { CreateMemberDTO } from "@/types/forms"

interface Props {
  freelancerId: string
  members: UserLite[]
  refresh: () => void
}

export function FreelancerMembers({ freelancerId, members, refresh }: Props) {
  const { accessToken } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleDelete(id: string) {
    if (!accessToken) return

    await removeMember(id, accessToken)
    refresh()
  }

  async function handleAdd(data: CreateMemberDTO) {
    if (!accessToken) return

    setLoading(true)

    try {
      // ⚠️ freelancerId sera injecté depuis page
      await addMember(freelancerId, data, accessToken)
      refresh()
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }

  return (
    <div className="space-y-4">

      {/* LIST */}
      <div className="space-y-2">
        {members.map(member => (
          <div
            key={member.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>

            <Button
              onClick={() => handleDelete(member.id)}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </div>

      {/* ADD */}
      <MemberForm loading={loading} onSubmit={handleAdd} setLoading={setLoading} />

    </div>
  )
}




// "use client"

// import { FreelancerMember } from "@/types/database"
// import { useAuth } from "@/features/auth/auth-provider"
// import { removeMember } from "@/features/freelancers/freelancer.service"

// interface Props {
//   refresh: () => void
//   members: FreelancerMember[]
// }

// export function FreelancerMembers({ refresh, members }: Props) {
//   const { accessToken } = useAuth()

//   async function handleRemove(id: string) {
//     if (!accessToken) return

//     await removeMember(id, accessToken)
//     refresh()
//   }

//   return (
//     <div className="space-y-2">

//       {members.map(member => (
//         <div
//           key={member.id}
//           className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
//         >
//           <div>
//             <p className="font-medium">{member.name}</p>
//             <p className="text-sm text-gray-500">{member.role}</p>
//           </div>

//           <button
//             className="text-red-500 text-sm"
//             onClick={() => handleRemove(member.id)}
//           >
//             Supprimer
//           </button>
//         </div>
//       ))}

//     </div>
//   )
// }



// import { FreelancerMember } from "@/types/database"

// interface Props {
//   members: FreelancerMember[]
// }

// export function FreelancerMembers({ members }: Props) {

//   return (

//     <div className="space-y-2">

//       {members.map(member => (

//         <div
//           key={member.id}
//           className="border border-gray-200 rounded-lg p-3"
//         >

//           <p className="font-medium">
//             {member.name}
//           </p>

//           <p className="text-sm text-gray-500">
//             {member.role}
//           </p>

//         </div>

//       ))}

//     </div>

//   )
// }
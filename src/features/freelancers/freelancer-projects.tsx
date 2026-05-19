"use client"

import { Project } from "@/types/database"
import { useAuth } from "@/features/auth/auth-provider"
import { unassignFromProject } from "@/features/freelancers/freelancer.service"
import { useParams } from "next/navigation"

interface Props {
  refresh: () => void
  projects: Project[]
}

export function FreelancerProjects({ refresh, projects }: Props) {
  const { accessToken } = useAuth()
  const { id } = useParams<{ id: string }>()

  async function handleUnassign(projectId: string) {
    if (!accessToken) return

    await unassignFromProject(id, projectId, accessToken)
    refresh()
  }

  return (
    <div className="space-y-2">

      {projects.map(project => (
        <div
          key={project.id}
          className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{project.name}</p>
            <p className="text-sm text-gray-500">{project.status}</p>
          </div>

          <button
            className="text-red-500 text-sm"
            onClick={() => handleUnassign(project.id)}
          >
            Retirer
          </button>
        </div>
      ))}

    </div>
  )
}



// import { Project } from "@/types/database"

// interface Props {
//   projects: Project[]
// }

// export function FreelancerProjects({ projects }: Props) {

//   return (

//     <div className="space-y-2">

//       {projects.map(project => (

//         <div
//           key={project.id}
//           className="border border-gray-200 rounded-lg p-3"
//         >

//           <p className="font-medium">
//             {project.name}
//           </p>

//           <p className="text-sm text-gray-500">
//             {project.status}
//           </p>

//         </div>

//       ))}

//     </div>

//   )
// }












































































































// Maintenant fais la mise a jour de """"use client"

// import { useEffect, useState } from "react"
// import { DataTable } from "@/components/tables/data-table"
// import { freelancerColumns } from "@/features/freelancers/freelancers-columns"
// import { Freelancer } from "@/types/database"
// import { getFreelancers } from "@/features/freelancers/freelancer.service"
// import { useAuth } from "@/features/auth/auth-provider"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"

// export default function FreelancersPage() {
//   const [freelancers, setFreelancers] = useState<Freelancer[]>([])
//   const { accessToken } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!accessToken) return

//     getFreelancers(accessToken).then(setFreelancers)
//   }, [accessToken])

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-start">
//         <h1 className="text-xl font-semibold">
//           Prestataires
//         </h1>

//         <Button className="cursor-pointer" onClick={() => router.push("/freelancers/create")}>
//           + Ajouter
//         </Button>
//       </div>

//       <DataTable columns={freelancerColumns} data={freelancers} />
//     </div>
//   )
// }



// "use client"

// import { useRouter } from "next/navigation"
// import { FreelancerForm } from "@/features/freelancers/freelancer-form"
// import { useAuth } from "@/features/auth/auth-provider"
// import { CreateFreelancerDTO } from "@/types/forms"
// import { createFreelancer } from "@/features/freelancers/freelancer.service"
// import { useState } from "react"

// export default function CreateFreelancerPage() {
//   const router = useRouter()
//   const { accessToken } = useAuth()
//   const [loading, setLoading] = useState(false)

//   async function handleSubmit(data: CreateFreelancerDTO) {
//     if (!accessToken) return
//     await createFreelancer(data, accessToken)
//     router.push("/freelancers")
//   }

//   return (
//     <div className="flex justify-center items-start min-h-screen">
//       <div className="w-[500px] space-y-6">
//         <h1 className="text-xl font-semibold">Créer freelancer</h1>

//         <FreelancerForm loading={loading} onSubmit={handleSubmit} setLoading={setLoading} />
//       </div>
//     </div>
//   )
// }




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




// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { useAuth } from "@/features/auth/auth-provider"
// import { FreelancerForm } from "@/features/freelancers/freelancer-form"
// import { getFreelancer, updateFreelancer } from "@/features/freelancers/freelancer.service"
// import { CreateFreelancerDTO } from "@/types/forms"

// export default function EditFreelancerPage() {
//   const { id } = useParams<{ id: string }>()
//   const router = useRouter()
//   const { accessToken } = useAuth()
//   const [loading, setLoading] = useState(false)

//   const [form, setForm] = useState<CreateFreelancerDTO | null>(null)

//   useEffect(() => {
//     if (!accessToken) return

//     getFreelancer(id, accessToken).then((data) => {
//       setForm({
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         specialty: data.specialty,
//         status: data.status,
//       })
//     })
//   }, [id, accessToken])

//   async function handleSubmit(data: CreateFreelancerDTO) {
//     if (!accessToken) return

//     await updateFreelancer(id, data, accessToken)
//     router.push("/freelancers")
//   }

//   if (!form) return <p>Loading...</p>

//   return (
//     <div className="flex justify-center items-start min-h-screen">
//       <div className="w-[500px] space-y-6">
//         <h1 className="text-xl font-semibold">Modifier freelancer</h1>

//         <FreelancerForm loading={loading} setLoading={setLoading} initialData={form} onSubmit={handleSubmit} />
//       </div>
//     </div>
//   )
// }



// import { Card, CardContent } from "@/components/ui/card"
// import { Freelancer } from "@/types/database"

// interface Props {
//   freelancer: Freelancer
// }

// export function FreelancerCard({ freelancer }: Props) {

//   return (

//     <Card>

//       <CardContent className="p-4">

//         <h3 className="font-medium">
//           {freelancer.name}
//         </h3>

//         <p className="text-sm text-gray-500">
//           {freelancer.specialty}
//         </p>

//         <p className="text-sm mt-2">
//           {freelancer.email}
//         </p>

//       </CardContent>

//     </Card>

//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { FreelancerStatus } from "@/types/database"

// interface FreelancerFormData {
//   name: string
//   email?: string
//   phone?: string
//   specialty?: string
//   status?: FreelancerStatus
// }

// interface Props {
//   loading: boolean
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>
//   onSubmit: (data: FreelancerFormData) => void
//   initialData?: FreelancerFormData
// }

// export function FreelancerForm({ onSubmit, initialData, loading, setLoading }: Props) {
//   const [form, setForm] = useState<FreelancerFormData>({
//     name: initialData?.name ?? "",
//     email: initialData?.email ?? "",
//     phone: initialData?.phone ?? "",
//     specialty: initialData?.specialty ?? "",
//     status: initialData?.status ?? "ACTIVE",
//   })

//   function handleSubmit(form: FreelancerFormData) {
//     try {
//       setLoading(true)
//       onSubmit(form)
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setTimeout(() => {
//         setLoading(false)
//       }, 2000);
//     }
//   }

//   return (
//     <>
// <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-1">
//           <Input
//             placeholder="Nom"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//     </div>
//       <div className="space-y-1">
//       <Input
//         placeholder="Email"
//         value={form.email ?? ""}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       /></div>

//       <div className="space-y-1">
//       <Input
//         placeholder="Téléphone"
//         value={form.phone ?? ""}
//         onChange={(e) => setForm({ ...form, phone: e.target.value })}
//       /></div>

//       <div className="space-y-1">
//       <Input
//         placeholder="Spécialité"
//         value={form.specialty ?? ""}
//         onChange={(e) => setForm({ ...form, specialty: e.target.value })}
//       /></div>

//     </div>
    
//     <div className="space-y-1">
//           <select
//             className="w-full h-11 border rounded px-3"
//             value={form.status}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 status: e.target.value as FreelancerStatus,
//               })
//             }
//           >
//             <option value="ACTIVE">ACTIVE</option>
//             <option value="INACTIVE">INACTIVE</option>
//           </select>
//     </div>


//       <Button disabled={loading} className="w-full h-11 cursor-pointer" onClick={() => handleSubmit(form)}>
//         { loading ? "Chargement..." : "Sauvegarder"}
//       </Button>
//       </>
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



// "use client";

// import { ColumnDef } from "@tanstack/react-table"
// import { Freelancer } from "@/types/database"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"

// function FreelancerActions({ freelancer }: { freelancer: Freelancer}){
//   const router = useRouter()

//   return (
//     <div className="flex gap-2">
//       <Button
//         className="text-sm cursor-pointer"
//         onClick={() =>
//           router.push(`/freelancers/${freelancer.id}`)
//         }
//       >
//         Voir
//       </Button>

//       <Button
//         className="text-sm cursor-pointer"
//         variant="outline"
//         onClick={() =>
//           router.push(`/freelancers/${freelancer.id}/edit`)
//         }
//       >
//         Modifier
//       </Button>
//     </div>
//   )
// }

// export const freelancerColumns: ColumnDef<Freelancer>[] = [
//   { accessorKey: "name", header: "Nom" },
//   { accessorKey: "email", header: "Email" },
//   { accessorKey: "phone", header: "Telephone" },
//   { accessorKey: "specialty", header: "Spécialité" },
//   { accessorKey: "status", header: "Status" },

//   {
//     id: "actions",
//     cell: ({ row }) => <FreelancerActions freelancer={row.original} />
//   },
// ]



// import { Project } from "@/types/database"

// interface Props {
//   projects: Project[]
// }

// export function FreelancerProjects({ projects }: Props) {

//   return (

//     <div className="space-y-2">

//       {projects.map(project => (

//         <div
//           key={project.id}
//           className="border border-gray-200 rounded-lg p-3"
//         >

//           <p className="font-medium">
//             {project.name}
//           </p>

//           <p className="text-sm text-gray-500">
//             {project.status}
//           </p>

//         </div>

//       ))}

//     </div>

//   )
// } """ pour que la partie  """ // DELETE
// export async function deleteFreelancer(id: string, token: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${id}`, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${token}` },
//   })

//   if (!res.ok) throw new Error("Erreur suppression freelancer")
//   return res.json()
// }

// // ADD MEMBER
// export async function addMember(
//   freelancerId: string,
//   data: Omit<FreelancerMember, "id" | "freelancerId">,
//   token: string
// ) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/members`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   })

//   if (!res.ok) throw new Error("Erreur ajout membre")
//   return res.json()
// }

// // REMOVE MEMBER
// export async function removeMember(memberId: string, token: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/members/${memberId}`, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${token}` },
//   })

//   if (!res.ok) throw new Error("Erreur suppression membre")
//   return res.json()
// }

// // ASSIGN PROJECT
// export async function assignToProject(
//   freelancerId: string,
//   projectId: string,
//   token: string
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/assign/${projectId}`,
//     {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   )

//   if (!res.ok) throw new Error("Erreur assign project")
//   return res.json()
// }

// // UNASSIGN PROJECT
// export async function unassignFromProject(
//   freelancerId: string,
//   projectId: string,
//   token: string
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/unassign/${projectId}`,
//     {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   )

//   if (!res.ok) throw new Error("Erreur unassign project")
//   return res.json()
// }""" soit bien configurer et ajouter
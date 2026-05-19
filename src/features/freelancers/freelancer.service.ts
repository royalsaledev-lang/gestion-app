import { Freelancer, UserLite } from "@/types/database"
import { CreateFreelancerDTO, UpdateFreelancerDTO } from "@/types/forms"
import { FreelancerFull } from "@/types/freelancer";


export async function getFreelancers(
  token: string,
  params?: { search?: string; status?: string }
): Promise<Freelancer[]> {
  const query = new URLSearchParams()

  if (params?.search) query.append("search", params.search)
  if (params?.status) query.append("status", params.status)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${query ? `/freelancers?${query.toString()}` : `/freelancers`}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erreur chargement freelancers")
  return res.json()
}

export async function getFreelancer(
  id: string,
  token: string
): Promise<FreelancerFull> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erreur freelancer")
  return res.json()
}

export async function createFreelancer(
  data: CreateFreelancerDTO,
  token: string
): Promise<Freelancer> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erreur création freelancer")
  return res.json()
}

export async function updateFreelancer(
  id: string,
  data: UpdateFreelancerDTO,
  token: string
): Promise<Freelancer> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erreur update freelancer")
  return res.json()
}

// DELETE
export async function deleteFreelancer(id: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erreur suppression freelancer")
  return res.json()
}

// ADD MEMBER
export async function addMember(
  freelancerId: string,
  data: Omit<UserLite, "id" | "freelancerId">,
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erreur ajout membre")
  return res.json()
}

// REMOVE MEMBER
export async function removeMember(memberId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/members/${memberId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erreur suppression membre")
  return res.json()
}

// ASSIGN PROJECT
export async function assignToProject(
  freelancerId: string,
  projectId: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/assign/${projectId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!res.ok) throw new Error("Erreur assign project")
  return res.json()
}

// UNASSIGN PROJECT
export async function unassignFromProject(
  freelancerId: string,
  projectId: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/unassign/${projectId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!res.ok) throw new Error("Erreur unassign project")
  return res.json()
}
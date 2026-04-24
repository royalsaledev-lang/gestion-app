import { CreateMemberDTO } from "@/types/forms"

export async function getFreelancerMembers(
  freelancerId: string,
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/${freelancerId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erreur récupération members")

  const data = await res.json()
  return data
}

export async function getMember(
  memberId: string,
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/members/${memberId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erreur récupération membre")

  return res.json()
}

export async function addMember(
  freelancerId: string,
  data: Omit<CreateMemberDTO, "id" | "freelancerId">,
  token: string
): Promise<CreateMemberDTO> {
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

export async function removeMember(memberId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/members/${memberId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error("Erreur suppression membre")
  return res.json()
}

export async function updateMember(
  memberId: string,
  data: Partial<Omit<CreateMemberDTO, "id" | "freelancerId">>,
  token: string
): Promise<CreateMemberDTO> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers/members/${memberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erreur update membre")
  return res.json()
}


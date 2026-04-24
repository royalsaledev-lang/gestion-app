import { Client } from "@/types/database"


export type CreateClientInput = {
  name: string
  email?: string
  phone?: string
  company?: string
  status: 
  | "ACTIVE"
  | "IN_PROGRESS"
  | "TO_FOLLOW"
  | "ISSUE"
  | "INACTIVE"
}

type UpdateClientInput = Partial<CreateClientInput>

export async function getClients(
  token: string,
  params?: { search?: string; status?: string }
): Promise<Client[]> {

  const query = new URLSearchParams()

  if (params?.search) query.append("search", params.search)
  if (params?.status) query.append("status", params.status)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${query ? `/clients?${query.toString()}` : "/clients"}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erreur chargement clients")

  return res.json()
}

export async function getClientById(
  id: string,
  token: string
): Promise<Client> {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Client introuvable")

  return res.json()
}

export async function createClient(
  data: CreateClientInput,
  token: string
): Promise<Client> {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erreur création client")

  return res.json()
}

export async function updateClient(
  id: string,
  data: UpdateClientInput,
  token: string
): Promise<Client> {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Erreur update client")

  return res.json()
}

export async function deleteClient(
  id: string,
  token: string
): Promise<{ message: string }> {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erreur suppression client")

  return res.json()
}


// const API_URL = process.env.NEXT_PUBLIC_API_URL

// export async function getClients(token: string) {
//   const res = await fetch(`${API_URL}/clients`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!res.ok) throw new Error("Erreur chargement clients")

//   return res.json()
// }

// export async function createClient(data: any, token: string) {
//   const res = await fetch(`${API_URL}/clients`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   })

//   if (!res.ok) throw new Error("Erreur création client")

//   return res.json()
// }

// export async function updateClient(id: string, data: any, token: string) {
//   const res = await fetch(`${API_URL}/clients/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   })

//   if (!res.ok) throw new Error("Erreur update client")

//   return res.json()
// }

// export async function deleteClient(id: string, token: string) {
//   const res = await fetch(`${API_URL}/clients/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!res.ok) throw new Error("Erreur suppression client")

//   return res.json()
// }


import { useAuth } from "@/features/auth/auth-provider"
import { fetchWithAuth } from "@/lib/fetcher"
import { User } from "@/types/database"
import { CreateUserForm } from "@/types/forms"

export async function getUsers(
  accessToken: string,
  refresh: () => Promise<string | null>
): Promise<User[]> {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {},
    accessToken,
    refresh
  )

  const data = await res.json()

  console.log(data);
  

  if (!res.ok) {
    throw new Error(
      data.message || "Erreur chargement utilisateurs"
    )
  }

  return data as User[]
}

// features/users/users.service.ts

export async function getUser(
  id: string,
  accessToken: string,
  refresh: () => Promise<string | null>
): Promise<User> {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {},
    accessToken,
    refresh
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Erreur utilisateur")
  }

  return data as User
}

export async function createUser(
  payload: CreateUserForm,
  accessToken: string,
  refresh: () => Promise<string | null>
): Promise<User> {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    accessToken,
    refresh
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Erreur création utilisateur")
  }

  return data as User
}

export async function updateUser(
  id: string,
  payload: Partial<User>,
  accessToken: string,
  refresh: () => Promise<string | null>
): Promise<User> {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    accessToken,
    refresh
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Erreur modification utilisateur")
  }

  return data as User
}


// import { apiFetch } from "@/lib/api/fetcher";

//   export async function getUsers(token: string) {
//     if(!token) return;
    
//     const data = await apiFetch(`/users`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     return data
//   }

import { useAuth } from "@/features/auth/auth-provider"
import { fetchWithAuth } from "@/lib/fetcher"

export async function getUsers(
  accessToken: string,
  refresh: () => Promise<string | null>
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {},
    accessToken,
    refresh
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Erreur utilisateurs")
  }

  return data
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
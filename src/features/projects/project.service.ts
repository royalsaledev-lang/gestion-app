import { Project } from "@/types/database"
import {
  CreateProjectDTO,
  UpdateProjectDTO,
} from "@/types/forms"

export async function getProjects(
  token: string,
  params?: {
    search?: string
    status?: string
  }
): Promise<Project[]> {
  const query = new URLSearchParams()

  if (params?.search) {
    query.append("search", params.search)
  }

  if (params?.status) {
    query.append("status", params.status)
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/projects${
    query.toString() ? `?${query.toString()}` : ""
  }`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Erreur chargement projets")
  }

  return res.json()
}

export async function getProject(
  id: string,
  token: string
): Promise<Project> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur projet")
  }

  return res.json()
}

export async function createProject(
  data: CreateProjectDTO,
  token: string
): Promise<Project> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) {
    throw new Error("Erreur création projet")
  }

  return res.json()
}

export async function updateProject(
  id: string,
  data: UpdateProjectDTO,
  token: string
): Promise<Project> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) {
    throw new Error("Erreur modification projet")
  }

  return res.json()
}

/* =========================
   PARTICIPANTS
========================= */

export async function assignParticipant(
  projectId: string,
  userId: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/participants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
      }),
    }
  )

  if (!res.ok) {
    throw new Error("Erreur assignation participant")
  }

  return res.json()
}

export async function removeParticipant(
  projectId: string,
  userId: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/participants/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur suppression participant")
  }

  return res.json()
}

export async function getProjectParticipants(
  projectId: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/participants`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur chargement participants")
  }

  return res.json()
}











// import { Project } from "@/types/database"
// import {
//   CreateProjectDTO,
//   UpdateProjectDTO,
// } from "@/types/forms"

// export async function getProjects(
//   token: string,
//   params?: {
//     search?: string
//     status?: string
//   }
// ): Promise<Project[]> {
//   const query = new URLSearchParams()

//   if (params?.search) {
//     query.append("search", params.search)
//   }

//   if (params?.status) {
//     query.append("status", params.status)
//   }

//   const url = `${process.env.NEXT_PUBLIC_API_URL}/projects${
//     query.toString() ? `?${query.toString()}` : ""
//   }`

//   const res = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!res.ok) {
//     throw new Error("Erreur chargement projets")
//   }

//   return res.json()
// }

// export async function getProject(
//   id: string,
//   token: string
// ): Promise<Project> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur projet")
//   }

//   return res.json()
// }

// export async function createProject(
//   data: CreateProjectDTO,
//   token: string
// ): Promise<Project> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/projects`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur création projet")
//   }

//   return res.json()
// }

// export async function updateProject(
//   id: string,
//   data: UpdateProjectDTO,
//   token: string
// ): Promise<Project> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
//     {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur modification projet")
//   }

//   return res.json()
// }

// /* =========================
//    PARTICIPANTS
// ========================= */

// export async function assignParticipant(
//   projectId: string,
//   userId: string,
//   token: string
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/participants`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         userId,
//       }),
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur assignation participant")
//   }

//   return res.json()
// }

// export async function removeParticipant(
//   projectId: string,
//   userId: string,
//   token: string
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/participants/${userId}`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur suppression participant")
//   }

//   return res.json()
// }

// export async function getProjectParticipants(
//   projectId: string,
//   token: string
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/participants`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur chargement participants")
//   }

//   return res.json()
// }


// import { Project } from "@/types/database"
// import { CreateProjectDTO, UpdateProjectDTO } from "@/types/forms"


// export async function getProjects(
//   token: string,
//   params?: { search?: string; status?: string }
// ): Promise<Project[]> {
//   const query = new URLSearchParams()

//   if (params?.search) query.append("search", params.search)
//   if (params?.status) query.append("status", params.status)

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${query ? `/projects?${query.toString()}` : `/projects`}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!res.ok) throw new Error("Erreur chargement projets")
//   return res.json()
// }

// export async function getProject(id: string, token: string): Promise<Project> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })

//   if (!res.ok) throw new Error("Erreur projet")
//   return res.json()
// }

// export async function createProject(
//   data: CreateProjectDTO,
//   token: string
// ): Promise<Project> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   })

//   if (!res.ok) throw new Error("Erreur création projet")
//   return res.json()
// }

// export async function updateProject(
//   id: string,
//   data: UpdateProjectDTO,
//   token: string
// ): Promise<Project> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   })

//   if (!res.ok) throw new Error("Erreur update projet")
//   return res.json()
// }


// export async function assignFreelancer(projectId: string, freelancerId: string, token: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/freelancers`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`
//     },
//     body: JSON.stringify({ freelancerId })
//   })

//   return res.json()
// }


import { CreateTaskDTO, UpdateTaskDTO } from "@/types/task"

export async function getTasks(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  
  return res.json()
}

export async function createTask(data: CreateTaskDTO, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

// 🔥 NEW → UPDATE TASK
export async function updateTask(
  taskId: string,
  data: UpdateTaskDTO,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!res.ok) throw new Error("Erreur update task")

  return res.json()
}

export async function assignTask(taskId: string, userId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  })

  if (!res.ok) throw new Error("Erreur assign task")

  return res.json()
}

export async function submitTask(taskId: string, token: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function approvePrestataire(taskId: string, token: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-prestataire`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function approveManager(taskId: string, token: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-manager`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
}

// const API = process.env.NEXT_PUBLIC_API_URL

// export async function assignTask(
//   taskId: string,
//   userId: string,
//   token: string
// ) {
//   const res = await fetch(`${API}/tasks/${taskId}/assign`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ userId }),
//   })

//   if (!res.ok) throw new Error("Erreur assign task")
//   return res.json()
// }
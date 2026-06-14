import { CreateTaskDTO, UpdateTaskDTO } from "@/types/task"
import { Client, Comment, Task } from "@/types/database"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getTasks(
  token: string
): Promise<Task[]> {
  const res = await fetch(
    `${API_URL}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur chargement tâches")
  }

  return res.json()
}

export async function getTaskById(
  taskId: string,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Tâche introuvable")
  }

  return res.json()
}

export async function createTask(
  data: CreateTaskDTO,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks`,
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
    throw new Error("Erreur création tâche")
  }

  return res.json()
}

export async function createSubTask(
  parentTaskId: string,
  data: CreateTaskDTO,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${parentTaskId}/subtasks`,
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
    throw new Error("Erreur création sous-tâche")
  }

  return res.json()
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskDTO,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}`,
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
    throw new Error("Erreur mise à jour tâche")
  }

  return res.json()
}

export async function assignTask(
  taskId: string,
  userId: string,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/assign`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    }
  )

  if (!res.ok) {
  const error = await res.text()

  console.error(error)

  throw new Error(error)
}

  return res.json()
}

export async function completeTask(
  taskId: string,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur soumission tâche")
  }

  return res.json()
}

export async function rejectTask(
  taskId: string,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur rejet tâche")
  }

  return res.json()
}

export async function approveManager(
  taskId: string,
  token: string
): Promise<Task> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/approve-manager`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur validation tâche")
  }

  return res.json()
}

/* ==========================
   COMMENTS
========================== */

export async function addComment(
  taskId: string,
  content: string,
  token: string
): Promise<Comment> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    }
  )

  if (!res.ok) {
    throw new Error("Erreur ajout commentaire")
  }

  return res.json()
}

export async function getComments(
  taskId: string,
  token: string
): Promise<Comment[]> {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur chargement commentaires")
  }

  return res.json()
}

export async function deleteComment(
  commentId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${API_URL}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Erreur suppression commentaire")
  }
}


// import { CreateTaskDTO, UpdateTaskDTO } from "@/types/task"
// import { Client, Task } from "@/types/database"

// export async function getTasks(
//   token: string
// ): Promise<Task[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur chargement tâches")
//   }

//   return res.json()
// }

// export async function createSubTask(
//   parentTaskId: string,
//   data: CreateTaskDTO,
//   token: string
// ): Promise<Task> {

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${parentTaskId}/subtasks`,
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
//     throw new Error("Erreur création sous-tâche")
//   }

//   return res.json()
// }

// export async function getClientById(
//   id: string,
//   token: string,
//   params?: {
//     search?: string
//     status?: string
//   }
// ): Promise<Client> {

//   const query = new URLSearchParams()

//   if (params?.search) {
//     query.append("search", params.search)
//   }

//   if (params?.status) {
//     query.append("status", params.status)
//   }

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/clients/${id}${
//       query.toString()
//         ? `?${query.toString()}`
//         : ""
//     }`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Client introuvable")
//   }

//   return res.json()
// }

// export async function getTaskById(
//   taskId: string,
//   token: string
// ): Promise<Task> {

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Tâche introuvable")
//   }

//   return res.json()
// }

// export async function createTask(
//   data: CreateTaskDTO,
//   token: string
// ): Promise<Task> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
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
//     throw new Error("Erreur création tâche")
//   }

//   return res.json()
// }

// export async function updateTask(
//   taskId: string,
//   data: UpdateTaskDTO,
//   token: string
// ): Promise<Task> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
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
//     throw new Error("Erreur mise à jour tâche")
//   }

//   return res.json()
// }

// export async function assignTask(
//   taskId: string,
//   userId: string,
//   token: string
// ): Promise<Task> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/assign`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ userId }),
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur assignation tâche")
//   }

//   return res.json()
// }

// export async function completeTask(
//   taskId: string,
//   token: string
// ): Promise<Task> {

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/complete`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur soumission tâche")
//   }

//   return res.json()
// }

// export async function rejectTask(
//   taskId: string,
//   token: string
// ): Promise<Task> {

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/reject`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur rejet tâche")
//   }

//   return res.json()
// }

// export async function approveManager(
//   taskId: string,
//   token: string
// ): Promise<Task> {

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-manager`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur validation tâche")
//   }

//   return res.json()
// }





// import { CreateTaskDTO, UpdateTaskDTO } from "@/types/task"
// import { Task } from "@/types/database"

// export async function getTasks(
//   token: string
// ): Promise<Task[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur chargement tâches")
//   }

//   return res.json()
// }

// export async function createTask(
//   data: CreateTaskDTO,
//   token: string
// ): Promise<Task> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
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
//     throw new Error("Erreur création tâche")
//   }

//   return res.json()
// }

// export async function updateTask(
//   taskId: string,
//   data: UpdateTaskDTO,
//   token: string
// ): Promise<Task> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
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
//     throw new Error("Erreur mise à jour tâche")
//   }

//   return res.json()
// }

// export async function assignTask(
//   taskId: string,
//   userId: string,
//   token: string
// ): Promise<Task> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/assign`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ userId }),
//     }
//   )

//   if (!res.ok) {
//     throw new Error("Erreur assignation tâche")
//   }

//   return res.json()
// }

// export async function submitTask(
//   taskId: string,
//   token: string
// ): Promise<Response> {
//   return fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/submit`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )
// }

// export async function approvePrestataire(
//   taskId: string,
//   token: string
// ): Promise<Response> {
//   return fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-prestataire`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )
// }

// export async function approveManager(
//   taskId: string,
//   token: string
// ): Promise<Response> {
//   return fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-manager`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )
// }



// import { CreateTaskDTO, UpdateTaskDTO } from "@/types/task"

// export async function getTasks(token: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
//     headers: { Authorization: `Bearer ${token}` },
//   })
  
//   return res.json()
// }

// export async function createTask(data: CreateTaskDTO, token: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   })
//   return res.json()
// }

// // 🔥 NEW → UPDATE TASK
// export async function updateTask(
//   taskId: string,
//   data: UpdateTaskDTO,
//   token: string
// ) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
//     {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   )

//   if (!res.ok) throw new Error("Erreur update task")

//   return res.json()
// }

// export async function assignTask(taskId: string, userId: string, token: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/assign`, {
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

// export async function submitTask(taskId: string, token: string) {
//   return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/submit`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//   })
// }

// export async function approvePrestataire(taskId: string, token: string) {
//   return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-prestataire`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//   })
// }

// export async function approveManager(taskId: string, token: string) {
//   return fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/approve-manager`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` },
//   })
// }

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
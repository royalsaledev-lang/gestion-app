export type TaskStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATION_REQUESTED"
  | "APPROVED"
  | "COMPLETED"

export type TaskBaseDTO = {
  title?: string
  description?: string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  startDate?: string
  deadline?: string
  assignedToId?: string
  status?: TaskStatus
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  projectId: string

  assignedToId?: string
  assignedTo?: {
    id: string
    name: string
  }

  createdAt: string
}


export interface CreateTaskDTO extends TaskBaseDTO {
  title: string
  projectId: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  startDate?: string
  deadline?: string
  assignedToId?: string
  status?: TaskStatus
}
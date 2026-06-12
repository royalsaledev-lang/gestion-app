import { Priority, UserLite } from "./database"

export type TaskStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "VALIDATION_REQUESTED"
  | "COMPLETED"
  | "REJECTED"

export type TaskBaseDTO = {
  title?: string
  description?: string

  priority?: Priority

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
  priority: Priority

  startDate?: string
  deadline?: string

  projectId: string

  createdById: string

  assignedToId?: string
  validatedById?: string

  createdAt: string
  updatedAt?: string

  createdBy?: UserLite
  assignedTo?: UserLite
  validatedBy?: UserLite
}

export interface CreateTaskDTO extends TaskBaseDTO {
  title: string
  projectId: string
  priority: Priority
}

export interface UpdateTaskDTO {
  title?: string
  description?: string

  priority?: Priority

  startDate?: string
  deadline?: string

  assignedToId?: string

  status?: TaskStatus
}
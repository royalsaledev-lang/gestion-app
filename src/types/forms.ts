import { Priority, TaskStatus, UserRole } from "./database"


export type ProjectStatus =
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BLOCKED"
  | "CANCELLED"

export interface CreateMemberDTO {
  name: string
  email: string
  role: UserRole
}

export interface CreateUserForm {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface CreateProjectDTO {
  name: string
  description?: string

  status?: ProjectStatus
  priority: Priority

  clientId?: string
  managerId?: string

  startDate?: string
  deadline?: string
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>


export interface CreateTaskDTO {
  title: string
  description?: string

  projectId: string

  assignedToId?: string

  startDate?: string
  deadline?: string

  priority: Priority
  status: TaskStatus
}



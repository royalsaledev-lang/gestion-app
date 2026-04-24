import { Priority, UserRole } from "./database"

import { FreelancerStatus } from "./database"

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
  status: ProjectStatus
}


export interface CreateFreelancerDTO {
  name: string
  email?: string
  phone?: string
  specialty?: string
  status?: FreelancerStatus
}

export type UpdateFreelancerDTO = Partial<CreateFreelancerDTO>


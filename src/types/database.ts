export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "EXECUTANT"
  | "PRESTATAIRE"

export type ClientStatus =
  | "ACTIVE"
  | "IN_PROGRESS"
  | "TO_FOLLOW"
  | "ISSUE"
  | "INACTIVE"

export type ProjectStatus =
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "BLOCKED"
  | "CANCELLED"

export type TaskStatus =
  | "DRAFT"
  | "VALIDATION_REQUESTED"
  | "APPROVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"

export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT"

export type PaymentStatus =
  | "NOT_PAID"
  | "ADVANCE"
  | "PAID"

export type FreelancerStatus =
  | "ACTIVE"
  | "INACTIVE"


export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  active: boolean

  createdAt: string
  updatedAt: string
}


export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string

  status: ClientStatus

  createdAt: string
}

export interface ProjectFreelancerRelation {
  id: string
  freelancer: Freelancer
}

export interface Project {
  id: string
  name: string
  description?: string

  status: ProjectStatus
  priority: Priority

  startDate?: string
  deadline?: string

  client?: {
    id: string
    name: string
  }

  manager?: {
    id: string
    name: string
  }

  freelancers?: {
    id: string
    freelancer: Freelancer
  }[]

  createdAt: string
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

  createdAt: string
}



export interface Freelancer {
  id: string

  name: string
  email?: string
  phone?: string
  specialty?: string

  members: UserLite

  user: User

  status: FreelancerStatus

  createdAt: string
}



export interface UserLite {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MANAGER" | "PRESTATAIRE" | "EXECUTANT"
}



export interface ProjectFreelancer {
  id: string

  projectId: string
  freelancerId: string
}



export interface Payment {
  id: string

  amount: number
  status: PaymentStatus

  projectId: string

  createdAt: string
}



export interface Comment {
  id: string

  content: string

  taskId: string
  authorId: string

  createdAt: string
}


export interface ActivityLog {
  id: string

  action: string

  taskId: string

  createdAt: string
}

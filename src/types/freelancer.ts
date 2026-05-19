import { FreelancerStatus, Project, UserLite } from "./database"

export interface FreelancerFull {
  id: string
  name: string
  email: string
  phone: string
  status: FreelancerStatus
  specialty: string

  user: UserLite // 🔥 prestataire

  members: UserLite[] // 🔥 executants

  projects: {
    project: Project
  }[]
}
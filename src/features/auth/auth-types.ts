import { UserRole } from "@/types/database"

export interface AuthUser {

  id: string
  name: string
  email: string
  freelancerId: string
  role: UserRole

}

export interface LoginDTO {

  email: string
  password: string

}
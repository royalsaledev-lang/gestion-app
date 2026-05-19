

export interface UpdateUserForm {
  name: string
  email: string
  phone?: string
  role: "ADMIN" | "MANAGER" | "PRESTATAIRE" | "EXECUTANT"
}
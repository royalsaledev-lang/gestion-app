import { Client, Freelancer, Payment, Project, Task, User, UserLite } from "./database"

export interface ProjectWithRelations extends Project {
  client?: Client
  manager?: User
  tasks?: Task[]
  payments?: Payment[]
}


export interface TaskWithRelations extends Task {
  project?: Project
  createdBy?: User
  assignedTo?: User
  comments?: Comment[]
}





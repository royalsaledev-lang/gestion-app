import { Client, Payment, Project, ProjectParticipant, Task, User, Comment } from "./database"

export interface ProjectWithRelations extends Project {
  client?: Client
  manager?: User

  participants?: ProjectParticipantWithUser[]

  tasks?: Task[]
  payments?: Payment[]
}

export interface ProjectParticipantWithUser extends ProjectParticipant {
  user: User
}

export interface TaskWithRelations extends Task {
  project?: Project
  createdBy?: User
  assignedTo?: User
  comments?: Comment[]
}





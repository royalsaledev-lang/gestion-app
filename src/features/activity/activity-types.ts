import { ActivityLog } from "@/types/database"
import { User } from "@/types/database"

export interface ActivityWithUser extends ActivityLog {

  user?: User

}

export interface Notification {

  id: string

  message: string

  read: boolean

  createdAt: string

}
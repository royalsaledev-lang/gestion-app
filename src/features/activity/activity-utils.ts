import { ActivityLog } from "@/types/database"

export function formatActivity(activity: ActivityLog) {

  switch (activity.action) {

    case "TASK_CREATED":
      return "created a task"

    case "TASK_ASSIGNED":
      return "assigned a task"

    case "TASK_COMPLETED":
      return "completed a task"

    case "COMMENT_ADDED":
      return "commented on a task"

    case "PAYMENT_RECEIVED":
      return "received a payment"

    default:
      return activity.action

  }

}
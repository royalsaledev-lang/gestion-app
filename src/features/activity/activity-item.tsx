import { ActivityWithUser } from "./activity-types"
import { formatActivity } from "./activity-utils"

interface Props {
  activity: ActivityWithUser
}

export function ActivityItem({ activity }: Props) {

  return (

    <div className="flex gap-3 p-3 border-b">

      <div className="text-sm">

        <span className="font-medium">
          {activity.user?.name ?? "User"}
        </span>

        {" "}

        {formatActivity(activity)}

      </div>

    </div>

  )
}
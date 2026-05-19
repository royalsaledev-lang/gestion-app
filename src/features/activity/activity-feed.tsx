import { ActivityWithUser } from "./activity-types"
import { ActivityItem } from "./activity-item"

interface Props {
  activities: ActivityWithUser[]
}

export function ActivityFeed({ activities }: Props) {

  return (

    <div className="border rounded-xl bg-white">

      <div className="p-4 border-b font-medium">
        Recent Activity
      </div>

      <div>

        {activities.map(activity => (

          <ActivityItem
            key={activity.id}
            activity={activity}
          />

        ))}

      </div>

    </div>

  )
}
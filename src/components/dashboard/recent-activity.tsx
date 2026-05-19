import { ActivityLog } from "@/types/database"

interface Props {
  activities: ActivityLog[]
}

export function RecentActivity({ activities }: Props) {

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      <h3 className="text-sm font-medium mb-4">
        Recent Activity
      </h3>

      <ul className="space-y-2">

        {activities.map(activity => (

          <li
            key={activity.id}
            className="text-sm text-gray-600"
          >
            {activity.action}
          </li>

        ))}

      </ul>

    </div>
  )
}
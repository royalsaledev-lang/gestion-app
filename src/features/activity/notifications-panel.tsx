import { Notification } from "./activity-types"

interface Props {
  notifications: Notification[]
}

export function NotificationsPanel({ notifications }: Props) {

  return (

    <div className="w-[320px] bg-white border rounded-xl shadow">

      <div className="p-4 border-b font-medium">
        Notifications
      </div>

      <div>

        {notifications.map(n => (

          <div
            key={n.id}
            className="p-3 border-b text-sm"
          >

            {n.message}

          </div>

        ))}

      </div>

    </div>

  )
}
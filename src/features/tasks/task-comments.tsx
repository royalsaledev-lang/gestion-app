import { Comment } from "@/types/database"

interface Props {
  comments: Comment[]
}

export function TaskComments({ comments }: Props) {

  return (

    <div className="space-y-3">

      {comments.map(comment => (

        <div
          key={comment.id}
          className="border border-gray-200 rounded-lg p-3"
        >
          <p className="text-sm">
            {comment.content}
          </p>
        </div>

      ))}

    </div>
  )
}
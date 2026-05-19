import { Button } from "@/components/ui/button"

interface Props {
  onEdit: () => void
  onDelete: () => void
}

export function TableActions({ onEdit, onDelete }: Props) {

  return (
    <div className="flex gap-2">

      <Button variant="secondary" onClick={onEdit}>
        Edit
      </Button>

      <Button variant="outline" onClick={onDelete}>
        Delete
      </Button>

    </div>
  )
}
export function TablePagination() {

  return (
    <div className="flex items-center justify-between p-4">

      <span className="text-sm text-gray-500">
        Showing 1–10
      </span>

      <div className="flex gap-2">

        <button className="px-3 py-1 border rounded">
          Previous
        </button>

        <button className="px-3 py-1 border rounded">
          Next
        </button>

      </div>

    </div>
  )
}
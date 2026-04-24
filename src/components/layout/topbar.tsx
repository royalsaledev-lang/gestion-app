import { SearchBar } from "./search-bar"
import { Avatar } from "@/components/ui/avatar"

export function Topbar() {

  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6">

      <SearchBar />

      <div className="flex items-center gap-4">

        <button className="text-sm">
          Notifications
        </button>

        <Avatar name="Admin User" />

      </div>

    </header>
  )
}
// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { CreateTaskDTO } from "@/types/forms"

// interface Props {
//   onSubmit: (data: CreateTaskDTO) => void
// }

// export function TaskForm({ onSubmit }: Props) {

//   const [form, setForm] = useState<CreateTaskDTO>({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     startDate: "",
//     deadline: "",
//     assignedToId: "",
//   })

//   function submit() {
//     onSubmit(form)
//   }

//   return (

//     <div className="space-y-4">

//       <Input
//         placeholder="Task title"
//         value={form.title}
//         onChange={(e) =>
//           setForm({ ...form, title: e.target.value })
//         }
//       />

//       <Input
//         placeholder="Description"
//         value={form.description}
//         onChange={(e) =>
//           setForm({ ...form, description: e.target.value })
//         }
//       />

//       <Button onClick={submit}>
//         Create Task
//       </Button>

//     </div>
//   )
// }
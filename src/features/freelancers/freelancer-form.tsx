"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FreelancerStatus } from "@/types/database"

interface FreelancerFormData {
  name: string
  email?: string
  phone?: string
  specialty?: string
  status?: FreelancerStatus
}

interface Props {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (data: FreelancerFormData) => void
  initialData?: FreelancerFormData
}

export function FreelancerForm({ onSubmit, initialData, loading, setLoading }: Props) {
  const [form, setForm] = useState<FreelancerFormData>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    specialty: initialData?.specialty ?? "",
    status: initialData?.status ?? "ACTIVE",
  })

  function handleSubmit(form: FreelancerFormData) {
    try {
      setLoading(true)
      onSubmit(form)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2000);
    }
  }

  return (
    <>
<div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
    </div>
      <div className="space-y-1">
      <Input
        placeholder="Email"
        value={form.email ?? ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /></div>

      <div className="space-y-1">
      <Input
        placeholder="Téléphone"
        value={form.phone ?? ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      /></div>

      <div className="space-y-1">
      <Input
        placeholder="Spécialité"
        value={form.specialty ?? ""}
        onChange={(e) => setForm({ ...form, specialty: e.target.value })}
      /></div>

    </div>
    
    <div className="space-y-1">
          <select
            className="w-full h-11 border rounded px-3"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as FreelancerStatus,
              })
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
    </div>


      <Button disabled={loading} className="w-full h-11 cursor-pointer" onClick={() => handleSubmit(form)}>
        { loading ? "Chargement..." : "Sauvegarder"}
      </Button>
      </>
  )
}



// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// interface FreelancerFormData {

//   name: string
//   email?: string
//   phone?: string
//   specialty?: string

// }

// interface Props {
//   onSubmit: (data: FreelancerFormData) => void
// }

// export function FreelancerForm({ onSubmit }: Props) {

//   const [form, setForm] = useState<FreelancerFormData>({
//     name: ""
//   })

//   function submit() {
//     onSubmit(form)
//   }

//   return (

//     <div className="space-y-4">

//       <Input
//         placeholder="Freelancer name"
//         value={form.name}
//         onChange={(e) =>
//           setForm({ ...form, name: e.target.value })
//         }
//       />

//       <Input
//         placeholder="Email"
//         value={form.email ?? ""}
//         onChange={(e) =>
//           setForm({ ...form, email: e.target.value })
//         }
//       />

//       <Input
//         placeholder="Phone"
//         value={form.phone ?? ""}
//         onChange={(e) =>
//           setForm({ ...form, phone: e.target.value })
//         }
//       />

//       <Input
//         placeholder="Specialty"
//         value={form.specialty ?? ""}
//         onChange={(e) =>
//           setForm({ ...form, specialty: e.target.value })
//         }
//       />

//       <Button onClick={submit}>
//         Create Freelancer
//       </Button>

//     </div>

//   )
// }
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setLoading(true);
      setError("");

      await login(form.email, form.password);

      router.push("/dashboard");
    } catch (e) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 px-6">

      {/* MOBILE LOGO */}
      <div className="md:hidden text-2xl font-bold text-center">
        Gestion RS
      </div>

      <div className="space-y-4">

        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="h-12 text-base"
        />

        <Input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="h-12 text-base"
        />

        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-gray-500 hover:text-black"
          >
            Mot de passe oublié ?
          </a>
        </div>

        <Button
          onClick={submit}
          className="w-full h-12 text-base font-medium cursor-pointer"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}






// "use client"

// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "./auth-provider"
// import { useRouter } from "next/navigation"

// export function LoginForm() {
//   const { login } = useAuth()
  
//   const router = useRouter()

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")


//   async function submit() {
//     try {
//       setLoading(true)
//       setError("")

//       await login(form.email, form.password)

//       router.push("/dashboard")
//     } catch (e) {
//       setError("Invalid email or password")
//     } finally {
//       setTimeout(() => {
//         setLoading(false)
//       }, 2000);
//     }
//   }

//   return (
//     <div className="space-y-5 w-[320px]">

//   <Input
//     placeholder="Email"
//     type="email"
//     value={form.email}
//     onChange={(e) =>
//       setForm({ ...form, email: e.target.value })
//     }
//     className="h-11 text-base"
//   />

//   <div className="space-y-2">
//     <Input
//       type="password"
//       placeholder="Password"
//       value={form.password}
//       onChange={(e) =>
//         setForm({ ...form, password: e.target.value })
//       }
//       className="h-11 text-base"
//     />

//     {/* 🔗 Forgot password */}
//     <div className="flex justify-end">
//       <a
//         href="/forgot-password"
//         className="text-sm text-gray-500 hover:text-black transition"
//       >
//         Mot de passe oublié ?
//       </a>
//     </div>
//   </div>

//   <Button
//     onClick={submit}
//     className="w-full h-11 text-base font-medium cursor-pointer"
//     disabled={loading}
//   >
//     {loading ? "Connexion..." : "Se connecter"}
//   </Button>

//   {error && (
//     <p className="text-red-500 text-sm">{error}</p>
//   )}

// </div>
//   )
// }













// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "./auth-provider"

// export function LoginForm() {
//   const { login } = useAuth()

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   async function submit() {
//     try {
//       setLoading(true)
//       setError("")

//       await login(form.email, form.password)

//       // 👉 redirect dashboard
//       window.location.href = "/dashboard"
//     } catch (e) {
//     //   if(e instanceof Error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-4 w-[300px]">
//       <Input
//         placeholder="Email"
//         value={form.email}
//         onChange={(e) =>
//           setForm({ ...form, email: e.target.value })
//         }
//       />

//       <Input
//         type="password"
//         placeholder="Password"
//         value={form.password}
//         onChange={(e) =>
//           setForm({ ...form, password: e.target.value })
//         }
//       />

//       {error && (
//         <p className="text-red-500 text-sm">{error}</p>
//       )}

//       <Button onClick={submit} className="w-full" disabled={loading}>
//         {loading ? "Loading..." : "Login"}
//       </Button>
//     </div>
//   )
// }
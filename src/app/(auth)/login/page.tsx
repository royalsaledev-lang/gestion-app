"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { LoginForm } from "@/features/auth/login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md text-white flex flex-col items-center space-y-8">

        {/* LOGO */}
        <img
          src="/rs_logo.png"
          alt="RS Logo"
          width={110}
          height={110}
          className="object-contain"
        />

        <h1 className="text-center text-gray-300">Bienvenue</h1>

        {/* MESSAGE */}
        <p className="text-center text-gray-300 text-base leading-relaxed">
          Entrer vos informations de connexion.
        </p>

        {/* FORM */}
        <div>
          <LoginForm />
        </div>

      </div>

    </div>
  );
}


// "use client";

// import { useAuth } from "@/features/auth/auth-provider";
// import { LoginForm } from "@/features/auth/login-form";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function LoginPage() {
//   const { accessToken } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (accessToken) {
//       router.push("/dashboard");
//     }
//   }, [accessToken]);

//   return (
//     <div className="min-h-screen flex">

//       {/* LEFT SIDE */}
// <div className="hidden md:flex w-1/2 bg-black text-white flex-col justify-center px-16">
//   <div className="space-y-6 max-w-md">

//     {/* LOGO */}
//     <div className="flex justify-center">
//       <img
//         src="/rs_logo.png"
//         alt="RS Logo"
//         width={100}
//         height={100}
//         className="object-contain"
//       />
//     </div>

//     {/* MESSAGE */}
//     <p className="text-lg text-gray-300 leading-relaxed text-center">
//       Bienvenue, veuillez entrer vos informations de connexion pour vous connecter.
//     </p>

//   </div>
// </div>

//       {/* RIGHT SIDE */}
//       <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
//         <LoginForm />
//       </div>

//     </div>
//   );
// }


// "use client";

// import { useAuth } from "@/features/auth/auth-provider";
// import { LoginForm } from "@/features/auth/login-form"
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function LoginPage() {
//   const { accessToken } = useAuth()
//     const router = useRouter()

//   useEffect(() => {
//     if(accessToken){
//       router.push('/loading')
//     }
//   }, [accessToken]);

//   return (

//     <div className="flex items-center justify-center h-screen">

//       <LoginForm />

//     </div>

//   )
// }
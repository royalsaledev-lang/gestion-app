"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"

import { AuthUser } from "./auth-types"
import { loginRequest, getMe, forgotPassword, resetPassword } from "./auth-service"
import { useToast } from "./ToastContext"

interface AuthContextType {
  user: AuthUser | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  refreshAccessToken: () => Promise<string | null>
  resetPassword: (token: string, password: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  // 🚪 LOGOUT
  function logout() {
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
    setUser(null)
    setAccessToken(null)
  }

  // 🔥 AUTO LOGIN (FIXED)
  useEffect(() => {
    const initAuth = async () => {
      try {
        let token = sessionStorage.getItem("accessToken")

        if (!token) return

        // essayer getMe
        try {
          const user = await getMe(token)
          setUser(user)
          setAccessToken(token)
        } catch {
          // 🔥 access expiré → refresh
          token = await refreshAccessToken()

          if (!token) return

          const user = await getMe(token)
          setUser(user)
        }
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // 🔐 LOGIN
  async function login(email: string, password: string) {
    const res = await loginRequest({ email, password })
    const data = await res.json()

    if(!res.ok){
      throw new Error(data.message || "Erreur login");
    }

    sessionStorage.setItem("accessToken", data.accessToken)
    sessionStorage.setItem("refreshToken", data.refreshToken)

    setAccessToken(data.accessToken)

    const user = await getMe(data.accessToken)
    setUser(user)
  }

  async function refreshAccessToken() {
    const refreshToken = sessionStorage.getItem("refreshToken")

    if (!refreshToken) {
      logout()
      return null
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error()
      }

      sessionStorage.setItem("accessToken", data.accessToken)
      sessionStorage.setItem("refreshToken", data.refreshToken)

      setAccessToken(data.accessToken)

      return data.accessToken
    } catch {
      logout()
      return null
    }
  }
  
  const forgot = async (email: string) => {
    try {
      const res = await forgotPassword(email)
      const data = await res.json()
      if(!res.ok){
        throw new Error(data.message || "Erreur inscription");
      }
      showToast(data.message, "success")
    } catch (error) {
      console.error(error)
      if(error instanceof Error){
        showToast(
          error.message || "Une erreur est survenue",
          "error"
        )
      }
    }
  }

  const reset = async(token: string, password: string) => {
    try {
      const res = await resetPassword(token, password)
      const data = await res.json()
      if(!res.ok){
        throw new Error(data.message || "Erreur inscription");
      }
      showToast(data.message, "success")
    } catch (error) {
      console.error(error)
      if(error instanceof Error){
        showToast(
          error.message || "Une erreur est survenue",
          "error"
        )
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{ 
        user, accessToken, login, logout, loading, 
        refreshAccessToken,
        forgotPassword: forgot,
        resetPassword: reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}


// "use client"

// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react"

// import { AuthUser } from "./auth-types"
// import { loginRequest, getMe } from "./auth-service"

// interface AuthContextType {
//   user: AuthUser | null
//   accessToken: string | null
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
//   loading: boolean
// }

// const AuthContext = createContext<AuthContextType | null>(null)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null)
//   const [accessToken, setAccessToken] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)


  
//   // 🚪 LOGOUT
//   function logout() {
//     sessionStorage.removeItem("accessToken")
//     setUser(null)
//     setAccessToken(null)
//   }


//   // 🔥 AUTO LOGIN (reload page)
//   useEffect(() => {
//     const token = sessionStorage.getItem("accessToken")

//     if (!token) {
//       setLoading(false)
//       return
//     }

//     setAccessToken(token)

//     getMe(token)
//       .then((user) => {
//         setUser(user)
//       })
//       .catch(() => {
//         logout()
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }, [])

//   // 🔐 LOGIN
//   async function login(email: string, password: string) {
//     const data = await loginRequest({ email, password })

//     sessionStorage.setItem("accessToken", data.accessToken)

//     setAccessToken(data.accessToken)

//     const user = await getMe(data.accessToken)

//     setUser(user)
//   }


//   return (
//     <AuthContext.Provider
//       value={{ user, accessToken, login, logout, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)

//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider")
//   }

//   return context
// }
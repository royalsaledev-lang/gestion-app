

export async function loginRequest(data: {
  email: string
  password: string
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Invalid credentials")
  }

  return res
}

export async function getMe(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Unauthorized")
  }

  return res.json()
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  return res
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  })

  return res
}
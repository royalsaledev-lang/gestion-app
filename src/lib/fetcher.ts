export async function fetchWithAuth(
    url: string,
    options: RequestInit = {},
    accessToken: string,
    refresh: () => Promise<string | null>
  ) {
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (res.status === 401) {
      const newToken = await refresh()

      if (!newToken) throw new Error("Session expirée")

      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      })
    }

    return res
  }
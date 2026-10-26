const url = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function api(path, method = 'GET', body) {
  const res = await fetch(url + path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: localStorage.getItem('token') || ''
    },
    body: body ? JSON.stringify(body) : undefined
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message)
  }
  return data
}

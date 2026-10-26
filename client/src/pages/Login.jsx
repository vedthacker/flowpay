import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = await api('/auth/login', 'POST', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <section className="card small">
      <h2>Login</h2>
      {msg && <p className="msg">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button>Login</button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </section>
  )
}

export default Login

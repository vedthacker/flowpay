import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await api('/auth/register', 'POST', { name, email, password })
      navigate('/login')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <section className="card small">
      <h2>Register</h2>
      {msg && <p className="msg">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button>Create Account</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </section>
  )
}

export default Register

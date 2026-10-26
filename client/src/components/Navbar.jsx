import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  return (
    <header>
      <h2>FlowPay</h2>
      <nav>
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && user.role === 'user' && (
          <>
            <Link to="/">Home</Link>
            <Link to="/pay">Pay</Link>
            <Link to="/split">Split</Link>
            <Link to="/history">History</Link>
          </>
        )}

        {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}

        {user && (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar

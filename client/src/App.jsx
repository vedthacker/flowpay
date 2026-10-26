import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Pay from './pages/Pay'
import Split from './pages/Split'
import History from './pages/History'
import Admin from './pages/Admin'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <main>
        {!user && (
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}

        {user && user.role === 'user' && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/split" element={<Split />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

        {user && user.role === 'admin' && (
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        )}
      </main>

      <footer>
        <p>FlowPay - Full Stack Development Project</p>
      </footer>
    </div>
  )
}

export default App

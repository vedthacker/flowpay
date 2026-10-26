import { useState, useEffect } from 'react'
import { api } from '../api'

function Admin() {
  const [data, setData] = useState({ users: [], pool: 0, rate: 0 })
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')

  async function loadStats() {
    const res = await api('/admin/stats')
    setData(res)
  }

  useEffect(() => {
    loadStats()
  }, [])

  async function addMaster(e) {
    e.preventDefault()
    try {
      const res = await api('/admin/master', 'POST', { amount })
      setMsg(res.message)
      setAmount('')
      loadStats()
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function giveInterest() {
    try {
      const res = await api('/admin/interest', 'POST')
      setMsg(res.message)
      loadStats()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      {msg && <p className="msg">{msg}</p>}

      <section className="hero">
        <p>Master wallet (pool)</p>
        <h1>₹{data.pool}</h1>
        <p>Current interest rate: {data.rate}% yearly</p>
      </section>

      <section className="row">
        <form className="card" onSubmit={addMaster}>
          <h3>Add money to master wallet</h3>
          <p>Money moves from the FlowPay company account in the bank.</p>
          <label>Amount
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <button className="green">Add to Master Wallet</button>
        </form>

        <div className="card">
          <h3>Monthly interest</h3>
          <p>Gives every user interest on their pay limit.</p>
          <button onClick={giveInterest}>Give Monthly Interest</button>
        </div>
      </section>

      <section className="card">
        <h3>All users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Pay limit</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>₹{u.balance}</td>
                <td>₹{u.pay_limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Admin

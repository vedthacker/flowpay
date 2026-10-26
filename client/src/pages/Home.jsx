import { useState, useEffect } from 'react'
import { api } from '../api'
import Location from '../components/Location'

function Home() {
  const [me, setMe] = useState({})
  const [account, setAccount] = useState('')
  const [pin, setPin] = useState('')
  const [amount, setAmount] = useState('')
  const [limit, setLimit] = useState(0)
  const [msg, setMsg] = useState('')

  async function loadMe() {
    const data = await api('/wallet/me')
    setMe(data)
    setLimit(data.pay_limit)
  }

  useEffect(() => {
    loadMe()
  }, [])

  async function addMoney(e) {
    e.preventDefault()
    try {
      const data = await api('/wallet/add', 'POST', { account, pin, amount })
      setMsg(data.message)
      setAmount('')
      setPin('')
      loadMe()
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function saveLimit(e) {
    e.preventDefault()
    try {
      const data = await api('/wallet/limit', 'POST', { limit })
      setMsg(data.message)
      loadMe()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      {msg && <p className="msg">{msg}</p>}

      <section className="hero">
        <p>Wallet balance</p>
        <h1>₹{me.balance}</h1>
        <p>Pay limit: ₹{me.pay_limit} (earns {me.rate}% yearly)</p>
      </section>

      <section className="row">
        <form className="card" onSubmit={addMoney}>
          <h3>Add money from bank</h3>
          <label>Bank account number
            <input value={account} onChange={(e) => setAccount(e.target.value)} />
          </label>
          <label>Bank PIN
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
          </label>
          <label>Amount
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <button className="green">Add Money</button>
        </form>

        <form className="card" onSubmit={saveLimit}>
          <h3>Set pay limit</h3>
          <p>Only the pay limit can be spent and it earns interest.</p>
          <h2>₹{limit}</h2>
          <input type="range" min="0" max={me.balance} value={limit} onChange={(e) => setLimit(e.target.value)} />
          <br />
          <button>Save Limit</button>
        </form>
      </section>

      <Location />
    </div>
  )
}

export default Home

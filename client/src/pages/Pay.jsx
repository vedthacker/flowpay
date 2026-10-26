import { useState, useEffect } from 'react'
import { api } from '../api'
import QuickPay from '../components/QuickPay'

function Pay() {
  const [me, setMe] = useState({})
  const [email, setEmail] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [merchant, setMerchant] = useState('')
  const [payAmount, setPayAmount] = useState('')
  const [msg, setMsg] = useState('')

  async function loadMe() {
    const data = await api('/wallet/me')
    setMe(data)
  }

  useEffect(() => {
    loadMe()
  }, [])

  async function sendMoney(e) {
    e.preventDefault()
    try {
      const data = await api('/wallet/send', 'POST', { email, amount: sendAmount })
      setMsg(data.message)
      setEmail('')
      setSendAmount('')
      loadMe()
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function payMerchant(e) {
    e.preventDefault()
    try {
      const data = await api('/wallet/pay', 'POST', { merchant, amount: payAmount })
      setMsg(data.message)
      setMerchant('')
      setPayAmount('')
      loadMe()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2>Pay</h2>
      <p>You can pay up to ₹{me.pay_limit}</p>
      {msg && <p className="msg">{msg}</p>}

      <QuickPay done={(text) => { setMsg(text); loadMe() }} />

      <section className="row">
        <form className="card" onSubmit={sendMoney}>
          <h3>Send to a user</h3>
          <label>Receiver email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>Amount
            <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
          </label>
          <button>Send</button>
        </form>

        <form className="card" onSubmit={payMerchant}>
          <h3>Pay a merchant</h3>
          <label>Merchant name
            <input value={merchant} onChange={(e) => setMerchant(e.target.value)} />
          </label>
          <label>Amount
            <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
          </label>
          <button>Pay</button>
        </form>
      </section>
    </div>
  )
}

export default Pay

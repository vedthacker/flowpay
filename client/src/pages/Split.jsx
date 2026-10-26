import { useState, useEffect } from 'react'
import { api } from '../api'

function Split() {
  const [total, setTotal] = useState('')
  const [emails, setEmails] = useState('')
  const [toMe, setToMe] = useState([])
  const [byMe, setByMe] = useState([])
  const [msg, setMsg] = useState('')

  async function loadSplits() {
    const data = await api('/splits')
    setToMe(data.toMe)
    setByMe(data.byMe)
  }

  useEffect(() => {
    loadSplits()
  }, [])

  async function createSplit(e) {
    e.preventDefault()
    try {
      const list = emails.split(',').map((x) => x.trim())
      const data = await api('/splits', 'POST', { total, emails: list })
      setMsg(data.message)
      setTotal('')
      setEmails('')
      loadSplits()
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function paySplit(id) {
    try {
      const data = await api('/splits/' + id + '/pay', 'POST')
      setMsg(data.message)
      loadSplits()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2>Split bill</h2>
      {msg && <p className="msg">{msg}</p>}

      <form className="card" onSubmit={createSplit}>
        <label>Total bill
          <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
        </label>
        <label>Friend emails (separate with comma)
          <input value={emails} onChange={(e) => setEmails(e.target.value)} />
        </label>
        <button>Create Split</button>
      </form>

      <section className="row">
        <div className="card">
          <h3>I have to pay</h3>
          <ul>
            {toMe.map((s) => (
              <li key={s.id}>
                ₹{s.amount} to {s.name} ({s.status}){' '}
                {s.status === 'pending' && <button onClick={() => paySplit(s.id)}>Pay</button>}
              </li>
            ))}
          </ul>
          {toMe.length === 0 && <p>Nothing to pay</p>}
        </div>

        <div className="card">
          <h3>Friends have to pay me</h3>
          <ul>
            {byMe.map((s) => (
              <li key={s.id}>₹{s.amount} from {s.name} ({s.status})</li>
            ))}
          </ul>
          {byMe.length === 0 && <p>No splits yet</p>}
        </div>
      </section>
    </div>
  )
}

export default Split

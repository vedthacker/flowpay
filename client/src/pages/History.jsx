import { useState, useEffect } from 'react'
import { api } from '../api'

function History() {
  const [list, setList] = useState([])

  useEffect(() => {
    api('/wallet/history').then((data) => setList(data))
  }, [])

  return (
    <section className="card">
      <h2>Transaction history</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Party</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>{t.type}</td>
              <td>{t.other_party}</td>
              <td className={t.type === 'sent' || t.type === 'paid' ? 'out' : 'in'}>
                ₹{t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && <p>No transactions yet</p>}
    </section>
  )
}

export default History

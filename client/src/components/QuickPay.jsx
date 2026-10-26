import { useState } from 'react'
import { api } from '../api'

const coins = [20, 50, 100, 500, 1000]

function QuickPay({ done }) {
  const [merchant, setMerchant] = useState('')
  const [over, setOver] = useState(false)

  function dragStart(e, coin) {
    e.dataTransfer.setData('text', coin)
  }

  async function drop(e) {
    e.preventDefault()
    setOver(false)
    const amount = e.dataTransfer.getData('text')
    if (!merchant) {
      done('enter merchant name first')
      return
    }
    try {
      const data = await api('/wallet/pay', 'POST', { merchant, amount })
      done(data.message + ': ₹' + amount + ' to ' + merchant)
    } catch (err) {
      done(err.message)
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow p-5 mb-5">
      <h3 className="m-0 text-lg font-bold">Quick pay</h3>
      <p className="text-gray-500 text-sm mt-1">Drag a coin and drop it in the box to pay</p>

      <label>Merchant name
        <input value={merchant} onChange={(e) => setMerchant(e.target.value)} />
      </label>

      <div className="flex flex-wrap gap-3 my-4">
        {coins.map((coin) => (
          <div
            key={coin}
            draggable
            onDragStart={(e) => dragStart(e, coin)}
            className="w-16 h-16 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center font-bold cursor-grab select-none"
          >
            ₹{coin}
          </div>
        ))}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
        className={'border-4 border-dashed rounded-2xl p-8 text-center font-semibold ' + (over ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-300 text-gray-400')}
      >
        Drop coin here to pay {merchant}
      </div>
    </section>
  )
}

export default QuickPay

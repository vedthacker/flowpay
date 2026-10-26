async function bankTransfer(from, pin, to, amount) {
  let res
  try {
    res = await fetch(process.env.BANK_URL + '/api/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, pin, to, amount })
    })
  } catch (err) {
    throw new Error('bank server is not running')
  }
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message)
  }
}

module.exports = bankTransfer

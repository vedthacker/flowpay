const db = require('./db')

async function sendMoney(fromId, toId, amount) {
  const [a] = await db.query('select * from users where id = ?', [fromId])
  const [b] = await db.query('select * from users where id = ?', [toId])

  if (!amount || amount <= 0) {
    throw new Error('enter valid amount')
  }
  if (amount > a[0].pay_limit) {
    throw new Error('amount is more than your pay limit')
  }

  await db.query('update users set balance = balance - ?, pay_limit = pay_limit - ? where id = ?', [amount, amount, fromId])
  await db.query('update users set balance = balance + ? where id = ?', [amount, toId])
  await db.query('insert into transactions (user_id, type, amount, other_party) values (?, ?, ?, ?)', [fromId, 'sent', amount, b[0].name])
  await db.query('insert into transactions (user_id, type, amount, other_party) values (?, ?, ?, ?)', [toId, 'received', amount, a[0].name])
}

module.exports = sendMoney

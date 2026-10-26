const express = require('express')
const db = require('../db')
const { auth, admin } = require('../middleware')
const bankTransfer = require('../bank')
const getRate = require('../rate')

const router = express.Router()

router.use(auth)
router.use(admin)

router.get('/stats', async (req, res) => {
  const [users] = await db.query('select id, name, email, balance, pay_limit from users where role = ?', ['user'])
  const [company] = await db.query('select pool from company')
  res.json({ users, pool: company[0].pool, rate: getRate(company[0].pool) })
})

router.post('/master', async (req, res) => {
  try {
    const amount = Number(req.body.amount)
    await bankTransfer(process.env.OWNER_ACCOUNT, process.env.OWNER_PIN, process.env.MASTER_ACCOUNT, amount)
    await db.query('update company set pool = pool + ?', [amount])
    res.json({ message: 'money added to master wallet' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/interest', async (req, res) => {
  const [users] = await db.query('select id, pay_limit from users where role = ? and pay_limit > 0', ['user'])
  const [company] = await db.query('select pool from company')
  const rate = getRate(company[0].pool)
  let total = 0
  for (const u of users) {
    const interest = Number((u.pay_limit * rate / 100 / 12).toFixed(2))
    await db.query('update users set balance = balance + ? where id = ?', [interest, u.id])
    await db.query('insert into transactions (user_id, type, amount, other_party) values (?, ?, ?, ?)', [u.id, 'interest', interest, 'FlowPay'])
    total = total + interest
  }
  await db.query('update company set pool = pool + ?', [total])
  res.json({ message: 'interest given to ' + users.length + ' users at ' + rate + '%' })
})

module.exports = router

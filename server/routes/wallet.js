const express = require('express')
const db = require('../db')
const { auth } = require('../middleware')
const bankTransfer = require('../bank')
const sendMoney = require('../send')
const getRate = require('../rate')

const router = express.Router()

router.use(auth)

router.get('/me', async (req, res) => {
  const [rows] = await db.query('select name, balance, pay_limit from users where id = ?', [req.user.id])
  const [company] = await db.query('select pool from company')
  const me = rows[0]
  me.rate = getRate(company[0].pool)
  res.json(me)
})

router.post('/add', async (req, res) => {
  try {
    const { account, pin } = req.body
    const amount = Number(req.body.amount)
    await bankTransfer(account, pin, process.env.MASTER_ACCOUNT, amount)
    await db.query('update users set balance = balance + ? where id = ?', [amount, req.user.id])
    await db.query('update company set pool = pool + ?', [amount])
    await db.query('insert into transactions (user_id, type, amount, other_party) values (?, ?, ?, ?)', [req.user.id, 'added', amount, 'Bank'])
    res.json({ message: 'money added from your bank' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/limit', async (req, res) => {
  const limit = Number(req.body.limit)
  const [rows] = await db.query('select balance from users where id = ?', [req.user.id])
  if (isNaN(limit) || limit < 0 || limit > rows[0].balance) {
    return res.status(400).json({ message: 'limit must be between 0 and your balance' })
  }
  await db.query('update users set pay_limit = ? where id = ?', [limit, req.user.id])
  res.json({ message: 'pay limit saved' })
})

router.post('/send', async (req, res) => {
  try {
    const [to] = await db.query('select id from users where email = ?', [req.body.email])
    if (to.length === 0) {
      return res.status(404).json({ message: 'user not found' })
    }
    if (to[0].id === req.user.id) {
      return res.status(400).json({ message: 'cannot send to yourself' })
    }
    await sendMoney(req.user.id, to[0].id, Number(req.body.amount))
    res.json({ message: 'money sent' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/pay', async (req, res) => {
  const { merchant } = req.body
  const amount = Number(req.body.amount)
  const [rows] = await db.query('select pay_limit from users where id = ?', [req.user.id])
  if (!merchant || !amount || amount <= 0) {
    return res.status(400).json({ message: 'enter merchant and valid amount' })
  }
  if (amount > rows[0].pay_limit) {
    return res.status(400).json({ message: 'amount is more than your pay limit' })
  }
  await db.query('update users set balance = balance - ?, pay_limit = pay_limit - ? where id = ?', [amount, amount, req.user.id])
  await db.query('update company set pool = pool - ?', [amount])
  await db.query('insert into transactions (user_id, type, amount, other_party) values (?, ?, ?, ?)', [req.user.id, 'paid', amount, merchant])
  res.json({ message: 'payment done' })
})

router.get('/history', async (req, res) => {
  const [rows] = await db.query('select * from transactions where user_id = ? order by id desc', [req.user.id])
  res.json(rows)
})

module.exports = router

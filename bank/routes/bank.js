const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../db')

const router = express.Router()

router.get('/accounts', async (req, res) => {
  const [rows] = await db.query('select account_no, holder, balance from accounts order by id')
  res.json(rows)
})

router.get('/transactions', async (req, res) => {
  const [rows] = await db.query('select * from bank_transactions order by id desc limit 15')
  res.json(rows)
})

router.post('/transfer', async (req, res) => {
  try {
    const { from, pin, to } = req.body
    const amount = Number(req.body.amount)
    if (!from || !pin || !to || !amount || amount <= 0 || from === to) {
      return res.status(400).json({ message: 'enter account, pin and valid amount' })
    }

    const [a] = await db.query('select * from accounts where account_no = ?', [from])
    const [b] = await db.query('select * from accounts where account_no = ?', [to])
    if (a.length === 0 || b.length === 0) {
      return res.status(404).json({ message: 'bank account not found' })
    }

    const ok = await bcrypt.compare(String(pin), a[0].pin)
    if (!ok) {
      return res.status(400).json({ message: 'wrong bank pin' })
    }
    if (Number(a[0].balance) < amount) {
      return res.status(400).json({ message: 'not enough bank balance' })
    }

    await db.query('update accounts set balance = balance - ? where account_no = ?', [amount, from])
    await db.query('update accounts set balance = balance + ? where account_no = ?', [amount, to])
    await db.query('insert into bank_transactions (from_account, to_account, amount) values (?, ?, ?)', [from, to, amount])
    res.json({ message: 'bank transfer done' })
  } catch (err) {
    res.status(500).json({ message: 'bank error' })
  }
})

module.exports = router

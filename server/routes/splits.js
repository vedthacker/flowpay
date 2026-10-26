const express = require('express')
const db = require('../db')
const { auth } = require('../middleware')
const sendMoney = require('../send')

const router = express.Router()

router.use(auth)

router.post('/', async (req, res) => {
  const total = Number(req.body.total)
  const emails = req.body.emails
  if (!total || total <= 0 || emails.length === 0) {
    return res.status(400).json({ message: 'enter total and friend emails' })
  }
  const share = (total / (emails.length + 1)).toFixed(2)
  const ids = []
  for (const email of emails) {
    const [rows] = await db.query('select id from users where email = ?', [email])
    if (rows.length === 0) {
      return res.status(404).json({ message: email + ' not found' })
    }
    ids.push(rows[0].id)
  }
  for (const id of ids) {
    await db.query('insert into splits (from_id, to_id, amount) values (?, ?, ?)', [req.user.id, id, share])
  }
  res.json({ message: 'split created, each person pays ' + share })
})

router.get('/', async (req, res) => {
  const [toMe] = await db.query('select s.id, s.amount, s.status, u.name from splits s join users u on s.from_id = u.id where s.to_id = ? order by s.id desc', [req.user.id])
  const [byMe] = await db.query('select s.id, s.amount, s.status, u.name from splits s join users u on s.to_id = u.id where s.from_id = ? order by s.id desc', [req.user.id])
  res.json({ toMe, byMe })
})

router.post('/:id/pay', async (req, res) => {
  try {
    const [rows] = await db.query('select * from splits where id = ? and to_id = ? and status = ?', [req.params.id, req.user.id, 'pending'])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'split not found' })
    }
    await sendMoney(req.user.id, rows[0].from_id, Number(rows[0].amount))
    await db.query('update splits set status = ? where id = ?', ['paid', req.params.id])
    res.json({ message: 'split paid' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router

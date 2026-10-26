const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'fill all fields' })
    }
    const [old] = await db.query('select id from users where email = ?', [email])
    if (old.length > 0) {
      return res.status(400).json({ message: 'email already registered' })
    }
    const hashed = await bcrypt.hash(password, 10)
    await db.query('insert into users (name, email, password) values (?, ?, ?)', [name, email, hashed])
    res.json({ message: 'account created' })
  } catch (err) {
    res.status(500).json({ message: 'server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query('select * from users where email = ?', [email])
    if (rows.length === 0) {
      return res.status(400).json({ message: 'wrong email or password' })
    }
    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(400).json({ message: 'wrong email or password' })
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET)
    res.json({ token, user: { name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'server error' })
  }
})

module.exports = router

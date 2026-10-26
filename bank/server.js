const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api', require('./routes/bank'))

app.listen(process.env.PORT || 3002, () => {
  console.log('bank server running')
})

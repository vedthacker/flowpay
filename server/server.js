const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/wallet', require('./routes/wallet'))
app.use('/api/splits', require('./routes/splits'))
app.use('/api/admin', require('./routes/admin'))

app.listen(process.env.PORT || 3001, () => {
  console.log('server running')
})

const express = require('express')
const app = express()
const bearerToken = require('express-bearer-token')
const router = require('./router')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(bearerToken())
app.use('/api', router)

app.listen(port, () => console.log(`Listening on port ${port}`))

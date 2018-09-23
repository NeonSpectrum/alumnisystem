require('dotenv').config()

const cors = require('cors')
const debug = require('debug')('console:system\t')

module.exports = debug

debug('Booting Alumni System API')

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bearerToken = require('express-bearer-token')
const router = require('./router')
const port = Number.isInteger(+process.argv[2]) ? +process.argv[2] : 3000

app.use(cors())
app.use(express.json())
app.use(bearerToken())
app.use('/api', router)

io.on('connection', socket => {
  socket.on('refreshData', data => {
    io.emit('refreshData', data)
  })
})

http.listen(port, () => debug(`Listening on port ${port}`))

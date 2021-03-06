require('dotenv').config({ path: process.cwd() + '/development.env' })

const fs = require('fs')
const cors = require('cors')
const debug = require('debug')('console:system\t')

debug('Booting Alumni System API')

const express = require('express')
const app = express()
const http = process.env.HTTPS
  ? require('https').createServer(
      {
        ca: fs.readFileSync('/var/www/key/ca_bundle.crt'),
        key: fs.readFileSync('/var/www/key/private.key'),
        cert: fs.readFileSync('/var/www/key/certificate.crt')
      },
      app
    )
  : require('http').createServer(app)
const io = require('socket.io')(http)
const bearerToken = require('express-bearer-token')
const router = require('./router')
const port = Number.isInteger(+process.argv[2]) ? +process.argv[2] : +process.env.NODE_PORT

app.use(cors())
app.use(express.json())
app.use(bearerToken())
app.use('/', router)

io.on('connection', socket => {
  socket.on('refreshData', data => {
    io.emit('refreshData', data)
  })
})

http.listen(port, () => debug(`Listening on port ${port}`))

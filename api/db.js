require('dotenv').config({ path: process.cwd() + '/development.env' })

const mysql = require('mysql')
const debug = require('debug')('console:database\t')

debug('Booting Database Module')

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config)
    this.connection.connect(err => {
      if (err) throw err
      debug('Database Connected!')
    })
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        //debug('Query: ' + sql)
        if (err) return reject(err)
        resolve(rows)
      })
    })
  }
}

const db = new Database({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'alumnisystem'
})

module.exports = db

const { encrypt, decrypt } = require('./crypt')
const Database = require('./db')
const db = new Database({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alumnisystem'
})

module.exports = {
  userLogin: (id, code) => {
    return new Promise(async (resolve, reject) => {
      let row = await db.query('SELECT * FROM student WHERE ID=?', [id])
      if (row.length > 0 && code === decrypt(row[0].Code)) {
        resolve(encrypt(JSON.stringify({ id, code: Code })))
      } else {
        reject()
      }
    })
  },
  userRegister: info => {
    let { id, code, firstname, lastname, birthday, course, yearGraduated } = info
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query(`INSERT INTO student VALUES ?`, [
        [id, encrypt(code), firstname, lastname, birthday, course, yearGraduated]
      ])
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  },
  adminLogin: (user, pass) => {
    return new Promise(async (resolve, reject) => {
      let row = await db.query('SELECT * FROM admin WHERE Username=?', [user])
      if (row.length > 0 && pass === decrypt(row[0].Password)) {
        resolve(encrypt(JSON.stringify({ user, pass, firstname: row[0].FirstName, lastname: row[0].LastName })))
      } else {
        reject()
      }
    })
  },
  adminRegister: info => {
    let { username, password, firstname, lastname } = info
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query('INSERT INTO admin VALUES(null, ?, ?, ?, ?)', [
        username,
        encrypt(password),
        firstname,
        lastname
      ])
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  },
  getUserInfo: (id, token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var { id, code } = JSON.parse(decrypt(token))
      } catch (err) {
        reject('Invalid Token.')
      }
      let row = await db.query('SELECT * FROM student WHERE ID=?', [id])
      if (row.length > 0 && code === decrypt(row[0].Code)) {
        delete row[0].Code
        resolve(row[0])
      } else {
        reject('Invalid Token.')
      }
    })
  },
  setProfileFileName: (id, filename) => {
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query('UPDATE student SET ProfileFileName=? WHERE ID=?', [filename, id])
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  }
}

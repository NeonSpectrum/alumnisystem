const moment = require('moment')
const { encrypt, decrypt } = require('./crypt')
const Jimp = require('jimp')
const db = require('./db')

module.exports = {
  userLogin: (id, code) => {
    return new Promise(async (resolve, reject) => {
      let row = await db.query('SELECT * FROM student WHERE ID=?', [id])
      if (row.length > 0 && code === decrypt(row[0].Code)) {
        resolve(encrypt(JSON.stringify({ id, code })))
      } else {
        reject()
      }
    })
  },
  userRegister: info => {
    let { id, code, firstname, lastname, birthday, course, yearGraduated } = info
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query(`INSERT INTO student VALUES ?`, [
        [[id, encrypt(code), firstname, lastname, birthday, course, yearGraduated, null]]
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
        console.log('sucess')
        resolve(encrypt(JSON.stringify({ user, pass })))
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
  getAdminInfo: (user, token) => {
    return new Promise(async (resolve, reject) => {
      try {
        var { user, pass } = JSON.parse(decrypt(token))
      } catch (err) {
        reject('Invalid Token.')
      }
      let row = await db.query('SELECT * FROM admin WHERE Username=?', [user])
      if (row.length > 0 && pass === decrypt(row[0].Password)) {
        delete row[0].Password
        resolve(row[0])
      } else {
        reject('Invalid Token.')
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
  },
  setSignatureFileName: (id, filename) => {
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query('UPDATE student SET SignatureFileName=? WHERE ID=?', [filename, id])
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  },
  fetchStudents: token => {
    return new Promise(async (resolve, reject) => {
      try {
        var { user, pass } = JSON.parse(decrypt(token))
      } catch (err) {
        reject('Invalid Token.')
      }
      let row = await db.query('SELECT * FROM admin WHERE Username=?', [user])
      if (row.length > 0 && pass === decrypt(row[0].Password)) {
        let rows = await db.query(
          'SELECT ID, FirstName as "First Name", Birthday, Course, YearGraduated as "Year Graduated" FROM student'
        )
        resolve(
          rows.map(x => {
            x.Birthday = moment(x.Birthday).format('MMMM d, YYYY')
            return x
          })
        )
      } else {
        reject('Invalid Token.')
      }
    })
  },
  fetchTemplates: (id = null) => {
    return new Promise(async (resolve, reject) => {
      if (id) {
        var rows = await db.query('SELECT * FROM id_template WHERE ID=?', [id])
      } else {
        var rows = await db.query('SELECT * FROM id_template')
      }
      resolve(rows)
    })
  },
  addTemplate: (name, filename) => {
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query('INSERT INTO id_template (Name, Filename) VALUES (?, ?)', [name, filename])
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  },
  editTemplate: (id, data) => {
    return new Promise(async (resolve, reject) => {
      let { picture, info, signature } = data
      let { affectedRows } = await db.query(
        'UPDATE id_template SET Picture=?, Info=?, Signature=?, TimeStamp=NOW() WHERE ID=?',
        [picture, info, signature, id]
      )
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  },
  deleteTemplate: id => {
    return new Promise(async (resolve, reject) => {
      let { affectedRows } = await db.query('DELETE FROM id_template WHERE id=?', [id])
      if (affectedRows > 0) {
        resolve()
      } else {
        reject()
      }
    })
  },
  getSamplePicture: cardid => {
    return new Promise(async (resolve, reject) => {
      let template = await db.query('SELECT * FROM id_template WHERE ID=?', [cardid])

      let { Filename, Picture, Info, Signature } = template[0]

      Picture = Picture.split(',').map(Number)
      Info = Info.split(',').map(Number)
      Signature = Signature.split(',').map(Number)

      let profile = await Jimp.read(__dirname + '/uploads/default.jpg')
      let signature = await Jimp.read(__dirname + '/uploads/signature.png')

      profile.resize(Picture[3] || 300, Picture[2] || 300)
      signature.resize(Signature[3] || 200, Signature[2] || 400)

      let details = [`Student Number: [SAMPLE TEXT]`, `Name: [SAMPLE TEXT]`, `Course: [SAMPLE TEXT]`]

      Jimp.read(__dirname + '/templates/' + Filename, async (err, image) => {
        if (err) reject(err)
        let pictureLength = Picture.reduce((x, y) => x + y)
        let infoLength = Info.reduce((x, y) => x + y)
        let signatureLength = Signature.reduce((x, y) => x + y)

        if (pictureLength != 0 && infoLength != 0 && signatureLength != 0) {
          let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
          for (var i = 0, j = 0; i < details.length; i++, j += 50) {
            image.print(font, Info[0], Info[1] + j, details[i], Info[3])
          }
          image.composite(profile, Picture[0], Picture[1])
          image.composite(signature, Signature[0], Signature[1])
        }
        resolve(await image.getBufferAsync(Jimp.MIME_PNG))
      })
    })
  },
  getFinalPicture: (studentno, cardid) => {
    return new Promise(async (resolve, reject) => {
      let [student, template] = await Promise.all([
        db.query('SELECT * FROM student WHERE ID=?', [studentno]),
        db.query('SELECT * FROM id_template WHERE ID=?', [cardid])
      ])

      let { Filename, Picture, Info, Signature } = template[0]
      let { FirstName, LastName, Course, ProfileFileName } = student[0]

      Picture = Picture.split(',').map(Number)
      Info = Info.split(',').map(Number)
      Signature = Signature.split(',').map(Number)

      let profile = await Jimp.read(__dirname + '/uploads/' + ProfileFileName)
      let signature = await Jimp.read(__dirname + '/uploads/' + SignatureFileName)

      profile.resize(Picture[3] || 300, Picture[2] || 300)
      signature.resize(Signature[3] || 200, Signature[2] || 400)

      let details = [`Student Number: ${studentno}`, `Name: ${FirstName} ${LastName}`, `Course: ${Course}`]

      Jimp.read(__dirname + '/templates/' + Filename, async (err, image) => {
        if (err) reject(err)
        let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
        for (var i = 0, j = 0; i < details.length; i++, j += 50) {
          image.print(font, Info[0], Info[1] + j, details[i], 600)
        }
        image.composite(profile, Picture[0], Picture[1])
        image.composite(profile, Signature[0], Signature[1])
        resolve(await image.getBufferAsync(Jimp.MIME_JPEG))
      })
    })
  }
}

const fs = require('fs')
const gm = require('gm')
const debug = require('debug')('console:http\t\t')
const router = require('express')()
const formidable = require('formidable')
const {
  userLogin,
  userRegister,
  adminLogin,
  adminRegister,
  getUserInfo,
  getAdminInfo,
  setProfileFileName,
  setSignatureFileName,
  fetchStudents,
  fetchTemplates,
  addTemplate,
  editTemplate,
  deleteTemplate,
  getFinalPicture,
  getSamplePicture
} = require('./process')

router.use((req, res, next) => {
  debug(req.method + ' ' + req.url + ' ' + JSON.stringify(req.body))
  next()
})

router.post('/user/login', (req, res) => {
  let { id, code } = req.body

  userLogin(id, code)
    .then(token => {
      res.send({ success: true, id, token })
    })
    .catch(() => {
      res.send({ success: false })
    })
})

router.put('/user/register', (req, res) => {
  userRegister(req.body)
    .then(() => {
      res.send({ success: true })
    })
    .catch(() => {
      res.send({ success: false })
    })
})

router.post('/admin/login', (req, res) => {
  let { username, password } = req.body

  adminLogin(username, password)
    .then(token => {
      res.send({ success: true, token })
    })
    .catch(() => {
      res.send({ success: false, token: null })
    })
})

router.put('/admin/register', (req, res) => {
  let { username, password, firstname, lastname } = req.body

  adminRegister({
    username,
    password,
    firstname,
    lastname
  })
    .then(() => {
      res.send({ success: true })
    })
    .catch(() => {
      res.send({ success: false })
    })
})

router.get('/admin/:user/data', (req, res) => {
  let { user } = req.params

  getAdminInfo(user, req.token)
    .then(data => {
      res.send({ success: true, info: data })
    })
    .catch(err => {
      res.status(401).send({ success: false })
    })
})

router.get('/user/:id/data', (req, res) => {
  let { id } = req.params

  getUserInfo(id, req.token)
    .then(data => {
      res.send({ success: true, info: data })
    })
    .catch(err => {
      res.status(401).send({ success: false })
    })
})

router.put('/user/:id/upload/:type', (req, res) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = __dirname + '/uploads'
  form.keepExtensions = true

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir)
  }
  form.parse(req, async function(err, fields, files) {
    let filename = files.photo.path.split(/[/|\\]/).pop()
    if (req.params.type == 'signature') {
      console.log(files.photo.path)
      gm(files.photo.path)
        .transparent('white')
        .write(files.photo.path, async function(err) {
          if (err) console.log(err)
          await setSignatureFileName(req.params.id, filename)
        })
    } else {
      await setProfileFileName(req.params.id, filename)
    }
    res.send({ success: true, filename, type: req.params.type })
  })
})

router.get('/user/pictures/:filename', (req, res) => {
  let filename = __dirname + '/uploads/' + req.params.filename
  let type = filename.split('.').pop()
  let img = fs.readFileSync(filename)
  res.writeHead(200, { 'Content-Type': 'image/' + type })
  res.end(img, 'binary')
})

router.get('/users/data', (req, res) => {
  fetchStudents(req.token)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(401).send(err)
    })
})

router.get('/user/card/:studentno/:cardid', (req, res) => {
  getFinalPicture(req.params.studentno, req.params.cardid)
    .then(image => {
      res.end(image, 'binary')
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/templates/:id/edit', (req, res) => {
  editTemplate(req.params.id, req.body)
    .then(() => {
      res.send({ success: true })
    })
    .catch(err => {
      res.send({ success: false, error: err })
    })
})

router.delete('/templates/:id/delete', (req, res) => {
  deleteTemplate(req.params.id)
    .then(() => {
      res.send({ success: true })
    })
    .catch(err => {
      res.send({ success: false, error: err })
    })
})

router.get('/templates/:id/sample', (req, res) => {
  getSamplePicture(req.params.id)
    .then(image => {
      res.end(image, 'binary')
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/templates/:id?/:type?', (req, res) => {
  let { id, type } = req.params

  fetchTemplates(parseInt(id) || null)
    .then(data => {
      if (parseInt(id) && type == 'image') {
        let filename = __dirname + '/templates/' + data[0].Filename
        let type = filename.split('.').pop()
        let img = fs.readFileSync(filename)
        res.writeHead(200, { 'Content-Type': 'image/' + type })
        res.end(img, 'binary')
      } else {
        res.send(data)
      }
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/templates/add', (req, res) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = __dirname + '/templates'
  form.keepExtensions = true

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir)
  }

  form.parse(req, async function(err, fields, files) {
    let filename = files.file.path.split(/[/|\\]/).pop()
    await addTemplate(fields.name, filename)
    res.send({ success: true, filename })
  })
})

module.exports = router

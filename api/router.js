const fs = require('fs')
const router = require('express')()
const formidable = require('formidable')
const { userLogin, userRegister, adminLogin, adminRegister, getUserInfo, setProfileFileName } = require('./process')

router.post('/user/login', (req, res) => {
  console.log(req.body)
  let { id, code } = req.body

  userLogin(id, code)
    .then(token => {
      res.send({ success: true, token })
    })
    .catch(() => {
      res.send({ success: false, token: null })
    })
})

router.put('/user/register', (req, res) => {
  console.log(req.body)
  let { id, code, firstname, lastname } = req.body

  userRegister({
    id,
    code,
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

router.post('/admin/login', (req, res) => {
  console.log(req.body)
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
  console.log(req.body)
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

router.get('/user/:id/data', (req, res) => {
  let { id } = req.params

  getUserInfo(id, req.token)
    .then(data => {
      res.send({ success: true, data })
    })
    .catch(err => {
      console.log(err)
      res.send({ success: false })
    })
})

router.put('/user/:id/upload', (req, res) => {
  var form = new formidable.IncomingForm()
  form.uploadDir = './uploads'
  form.keepExtensions = true

  form.parse(req, async function(err, fields, files) {
    await setProfileFileName(req.params.id, files.photo.path.replace('uploads\\', ''))
    res.end()
  })
})

router.get('/user/pictures/:filename', (req, res) => {
  let filename = './uploads/' + req.params.filename
  let type = filename.split('.').pop()
  let img = fs.readFileSync(filename)
  res.writeHead(200, { 'Content-Type': 'image/' + type })
  res.end(img, 'binary')
})

module.exports = router

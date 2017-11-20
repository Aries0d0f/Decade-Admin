const express =       require('express')
const path =          require('path')
const fileUpload =    require('express-fileupload')

const db = require('../model/db')
const route = express.Router()

route.use('/', (express.static(path.join(__dirname, '/../../dist'))))

route.use(fileUpload())

route.put('/upload', (req, res) => {
  var file = req.body.file
  console.log(file)
  file.mv(path.join(__dirname, '/../upload/', fileName, '.jpg'))
})

route.get('/api/user/:id', (req, res) => {
  db.User.findOne({ token: req.params.id }, (err, doc) => {
    if (err || !doc) {
      res.json({ result: -1 })
    } else {
      res.json(
        {
          result: 0,
          uid: doc._id,
          username: doc.username,
          role: doc.role,
          cid: doc.cid,
          state: doc.state
        }
      )
    }
  })
})

route.post('/api/user', (req, res) => {
  const account = req.body
  db.User.findOne(account, (err, doc) => {
    if (err || !doc) {
      res.json({ result: -1 })
    } else {
      res.json({
        result: 0,
        uid: doc._id,
        username: doc.username,
        role: doc.role,
        cid: doc.cid,
        state: doc.state
      })
    }
  })
})

route.put('/api/user/:id', (req, res) => {
  db.User.findOne({ _id: req.params.id }, (err, u) => {
    if (err) {
      res.json({ result: -1 })
    } else if (!u) {
      res.json({ result: -2 })
    } else {
      db.User.update({ _id: req.params.id },
        {
          token: (req.body.token) ? (req.body.token) : (u.token),
          username: (req.body.username) ? (req.body.username) : (u.username),
          pwd: (req.body.pwd) ? (req.body.pwd) : (u.pwd),
          meta: (req.body.meta) ? (req.body.meta) : (u.meta)
        }, (err, cb) => {
          if (err) res.json({ result: -3, err })
          else res.json({ result: 0 })
        }
      )
    }
  })
})

route.post('/api/user/new', (req, res) => {
  const {
    username,
    pwd
  } = req.body
  let user = new db.User({
    username: username,
    pwd: pwd,
    role: 0,
    state: 0,
    cid: -1
  })
  user.save((err, callback) => {
    if (err) {
      res.json({
        result: -1
      })
    } else {
      res.json({
        result: 0,
        uid: callback._id
      })
    }
  })
})

route.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../../dist/index.html'))
})

module.exports = route

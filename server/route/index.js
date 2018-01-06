const express         = require('express')
const path            = require('path')
const md5             = require('js-md5')

const route = express.Router()

route.use('/', (express.static(path.join(__dirname, '/../../dist'))))

route.put('/upload', (req, res) => {
  var file = req.files.file
  var fileName = `decade_${md5(file.name)}_${file.mimetype.replace('/', '.')}`
  // console.log(file, fileName)
  file.mv(path.join(__dirname, '/../../upload/', fileName), err => {
    if (err) return res.status(500).json({ result: 0 }, err)
    res.json({ result: 0, path: `/api/images/${fileName}` })
  })
})

route.use('/api/images', (express.static(path.join(__dirname, '/../../upload'))))

route.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../../dist/index.html'))
})

module.exports = route
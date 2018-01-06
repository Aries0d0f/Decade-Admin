const express         = require('express')
const bobyParser      = require('body-parser')
const fileUpload      = require('express-fileupload')

const app             = express()
const port            = 3002
const route           = require('./route')

app.use(bobyParser.json())
app.use(fileUpload())
app.use(route)
app.listen(port)
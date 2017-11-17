const express         = require('express')
const bobyParser      = require('body-parser')

const app             = express()
const port            = 3002
const route           = require('./route')

app.use(bobyParser.json())
app.use(route)
app.listen(port)

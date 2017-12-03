const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const uri = 'mongodb://192.168.2.150/decade'

mongoose.Promise = global.Promise

const userSchema = new Schema({
  token: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  pwd: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true
  },
  state: {
    type: Number,
    required: true
  },
  cid: {
    type: Number,
    required: true
  }
}, {
  collection: 'user'
})

const postSchema = new Schema({
  category: {
    type: Number,
    required: true
  },
  region: {
    type: Number,
    required: true
  },
  tag: {
    type: [String]
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  related: {
    type: [String]
  },
  author: {
    type: String,
    required: true
  },
  meta: {
    link: {
      type: String
    },
    image: {
      type: String
    }
  }

}, {
  collection: 'post'
})

userSchema.plugin(mongooseUniqueValidator)

const db = {
  User: mongoose.model('user', userSchema),
  Post: mongoose.model('post', postSchema)
}

mongoose.connect(uri, {
  user: 'decade',
  pass: 'd3cad3',
  useMongoClient: true
})
module.exports = db

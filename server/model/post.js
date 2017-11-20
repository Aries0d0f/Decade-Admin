var express = require('express')
const db = require('../model/db')

var router = express.Router()

// GET: Get all posts
// POST: Create a post
router.route('/')
  .get((req, res) => {
    db.Post.find((err, data) => {
      if (err)
        res.json({
          result: -1
        })
      else
        res.json({
          result: 0,
          data: data
        })
    })
  })
  .post((req, res) => {
    let new_post = new db.Post({
      category: 0,
      region: 0,
      tag: [],
      title: req.body.title,
      content: req.body.content,
      related: [],
      author: req.body.author,
      meta: {
        link: '',
        image: ''
      }
    })

    new_post.save((err, cb) => {
      if (err) {
        res.json({
          result: -1
        })
      } else
        res.json({
          result: 0,
          pid: cb._id
        })
    })
  })

// GET: get single post
// PUT: update single post
// DELETE: delete single post
router.route('/:pid')
  .get((req, res) => {
    db.Post.findOne({
      _id: req.params.pid
    }, (err, p) => {
      if (err || !p) {
        res.json({
          result: -1
        })
      } else {
        res.json({
          result: 0,
          category: p.category,
          region: p.region,
          tag: p.tag,
          title: p.title,
          content: p.content,
          related: p.related,
          author: p.author,
          meta: p.meta
        })
      }
    })
  })
  .put((req, res) => {
    db.Post.findOne({
      _id: req.params.pid
    }, (err, p) => {
      if (err) res.json({
        result: -1
      })
      else if (!p) res.json({
        result: -2
      })
      else {
        db.Post.update({
          _id: req.params.pid
        }, {
          category: (req.body.category) ? (req.body.category) : (p.category),
          region: (req.body.region) ? (req.body.region) : (p.region),
          tag: (req.body.tag) ? (req.body.tag) : (p.tag),
          title: (req.body.title) ? (req.body.title) : (p.title),
          content: (req.body.content) ? (req.body.content) : (p.content),
          related: (req.body.related) ? (req.body.related) : (p.related),
          author: (req.body.author) ? (req.body.author) : (p.author),
          meta: {
            link: (req.body.link) ? (req.body.link) : (p.link),
            image: (req.body.image) ? (req.body.image) : (p.image)
          }
        }, (err, cb) => {
          if (err) res.json({
            result: -3,
            err
          })
          else res.json({
            result: 0
          })
        })
      }
    })
  })
  .delete((req, res) => {
    db.Post.remove({
      _id: req.params.pid
    }, (err) => {
      if (err) res.json({
        result: -1
      })
      else res.json({
        result: 0
      })
    })
  })

// GET: get a category
router.route('/category/:cat')
  .get((req, res) => {
    db.Post.find({
      category: req.params.cat
    }, (err, data) => {
      if (err)
        res.json({
          result: -1
        })
      else
        res.json({
          result: 0,
          data: data
        })
    })
  })

// GET: get a region
router.route('/region/:reg')
  .get((req, res) => {
    db.Post.find({
      region: req.params.reg
    }, (err, data) => {
      if (err)
        res.json({
          result: -1
        })
      else
        res.json({
          result: 0,
          data: data
        })
    })
  })

// GET: get a author
router.route('/author/:uid')
  .get((req, res) => {
    db.Post.find({
      author: req.params.uid
    }, (err, data) => {
      if (err)
        res.json({
          result: -1
        })
      else
        res.json({
          result: 0,
          data: data
        })
    })
  })

module.exports = router

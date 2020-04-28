var express = require('express')
var router = express.Router()

/* GET all listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'PeerStream'})
})

module.exports = router

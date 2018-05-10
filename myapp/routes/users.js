var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/b', function(req, res, next) {
  res.send('/b');
});
module.exports = router;

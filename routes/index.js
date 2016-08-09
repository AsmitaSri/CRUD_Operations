var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/*router.post('/delete', function(req, res) {
  res.render('delete', { title: 'Delete' })
});*/

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(require('path').join(__dirname, '../../dist/cms/browser/index.html'));
});

module.exports = router;

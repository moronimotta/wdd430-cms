var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

var index = require('./server/routes/app');
var documents = require('./server/routes/documents');
var messages = require('./server/routes/messages');
var contacts = require('./server/routes/contacts');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

app.use('/', index);
app.use('/documents', documents);
app.use('/messages', messages);
app.use('/contacts', contacts);

mongoose.connect('mongodb://localhost:27017/cms')
  .then(function() {
    console.log('Connected to database!');
  })
  .catch(function(err) {
    console.log('Connection failed: ' + err);
  });

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

var port = process.env.PORT || 3000;

app.set('port', port);

app.listen(port, function() {
  console.log('API running on localhost: 3000');
});

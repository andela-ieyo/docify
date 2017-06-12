'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _index = require('./server/models/index');

var _index2 = _interopRequireDefault(_index);

var _auth = require('./server/config/middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

var _userRoutes = require('./server/routes/userRoutes');

var _userRoutes2 = _interopRequireDefault(_userRoutes);

var _documentRoutes = require('./server/routes/documentRoutes');

var _documentRoutes2 = _interopRequireDefault(_documentRoutes);

var _models = require('./server/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const Users = models.Users;
var Roles = _models2.default.Roles;

// Set up the express app

// import logger from 'morgan';
var app = (0, _express2.default)();

var port = process.env.PORT || 8000; // eslint-disable-line

// Log requests to the console.
// app.use(logger('combined'));

// Parse incoming requests data
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: false
}));
app.use(_express2.default.static('public'));
app.use(_auth2.default.initialize());

// routes middleware
app.use('/api', (0, _userRoutes2.default)());
app.use('/api', (0, _documentRoutes2.default)());

// Setup a default catch-all route that sends back a welcome message.
app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'app', 'index.html'));
});

var server = app.listen(port, function () {
  _index2.default.sequelize.sync().then(function () {
    Roles.findAll().then(function (roles) {
      if (!roles.length) {
        Roles.bulkCreate([{ title: 'Writer' }, { title: 'Editor' }, { title: 'Admin' }]);
      }
    });
  });
  console.log('Listening on port ' + port);
});

exports.default = server;

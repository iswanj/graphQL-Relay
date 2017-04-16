'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _schema = require('./data/schema');

var _schema2 = _interopRequireDefault(_schema);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphql = require('graphql');

var _utilities = require('graphql/utilities');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = (0, _express2.default)();

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(_express2.default.static('public'));

try {
  _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var db, schema, json;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _mongodb.MongoClient.connect(process.env.MONGO_URL);

          case 2:
            db = _context.sent;
            schema = (0, _schema2.default)(db);

            app.use('/graphql', (0, _cors2.default)(), (0, _expressGraphql2.default)({
              schema: schema,
              graphiql: true
            }));

            app.listen(4000, function () {
              return console.log('listening on port 4000');
            });

            //generate schema.json
            _context.next = 8;
            return (0, _graphql.graphql)(schema, _utilities.introspectionQuery);

          case 8:
            json = _context.sent;

            _fs2.default.writeFile('./data/schema.json', JSON.stringify(json, null, 2), function (err) {
              if (err) throw err;

              console.log("JSON schema created");
            });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }))();
} catch (e) {
  console.log("error: ", e);
};

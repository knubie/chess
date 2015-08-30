var R = require('ramda');
var Errors = require('../errors');

var checkType = R.curry(function(arg, x) {
  var t
  if (x === String) {
    tt = R.equals(R.type(arg), 'String');
  } else if (x === Number) {
    tt = R.equals(R.type(arg), 'Number');
  } else if (x === Boolean) {
    tt = R.equals(R.type(arg), 'Boolean');
  } else {
    tt = R.is(x, arg);
  }
  return tt;
});

module.exports = {
  check: R.curry(function(klass, obj) {
    if (!R.is(klass, obj)) {
      throw new Errors.TypeClassError('Invalid type.');
    }
  }),
  checkAll: R.curry(function(args, types) {
    var args = Array.prototype.slice.call(args);
    R.forEach(function(pair) {
      var arg = pair[0];
      var type = pair[1];
      var t;
      if (R.equals(R.type(type), 'Array')) {
        t = R.any(checkType(arg), type)
      } else {
        t = checkType(arg, type);
      }
      if (!t) {
        // TODO: log more details about the expected type and actual type.
        throw new Errors.TypeClassError('Invalid type.');
      }
    }, R.zip(args, types));
  })
}

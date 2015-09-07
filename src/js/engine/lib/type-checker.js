var R = require('ramda');
var Errors = require('../Errors');
for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}

var checkType = curry(function(arg, x) {
  var t
  if (x === String) {
    tt = equals(type(arg), 'String');
  } else if (x === Number) {
    tt = equals(type(arg), 'Number');
  } else if (x === Boolean) {
    tt = equals(type(arg), 'Boolean');
  } else {
    tt = is(x, arg);
  }
  return tt;
});

module.exports = {
  check: curry(function(klass, obj) {
    if (!is(klass, obj)) {
      throw new Errors.TypeClassError('Invalid type.');
    }
  }),
  checkAll: curry(function(args, types) {
    var args = Array.prototype.slice.call(args);
    forEach(function(pair) {
      var arg = pair[0];
      var typeclass = pair[1];
      var t;
      if (equals(type(typeclass), 'Array')) {
        t = any(checkType(arg), typeclass)
      } else {
        t = checkType(arg, typeclass);
      }
      if (!t) {
        // TODO: log more details about the expected type and actual type.
        throw new Errors.TypeClassError('Invalid type.');
      }
    }, zip(args, types));
  })
}

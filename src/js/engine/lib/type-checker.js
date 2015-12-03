var R = require('ramda');
var Errors = require('../Errors');
for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}

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
        t = all(is(typeclass[0]), arg);
      } else {
        t = is(typeclass, arg);
      }
      if (!t) {
        var typeclassName = '';
        var argName = '';
        if (is(Array, typeclass)) {
          typeclassName = '[' + typeclass[0].name + ']';
        } else {
          typeclassName = typeclass.name;
        }
        if (arg == null) {
          argName = type(arg);
        } else {
          argName = arg.constructor.name;
        }
        console.log(typeclassName);
        console.log(pair);
        throw new Errors.TypeClassError('Invalid type. Expected ' + typeclassName + ', but got ' + argName + ' instead.');
      }
    }, zip(args, types));
  })
}

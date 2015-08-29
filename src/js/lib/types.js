var R = require('ramda');
var Errors = require('../errors');

module.exports = {
  check: R.curry(function(klass, obj) {
    if (!R.is(klass, obj)) {
      throw new Errors.TypeClassError('Invalid type.');
    }
  })
}


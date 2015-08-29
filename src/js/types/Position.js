var R = require('ramda');
var Errors = require('../errors');

var Position = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.x != 'number'
    || typeof opts.y != 'number') {
    throw new Errors.TypeClassError('Invalid Position options.');
  }
  for (k in opts) { this[k] = opts[k] };
}

module.exports = Position;

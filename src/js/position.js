var R = require('ramda');
var Errors = require('./errors');
var Types = require('./lib/types');

var Position = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.x != 'number'
    || typeof opts.y != 'number') {
    throw new Errors.TypeClassError('Invalid Position options.');
  }
  for (k in opts) { this[k] = opts[k] };
}

var checkType = Types.check(Position);

module.exports = Position;


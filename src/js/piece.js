var R = require('ramda');
var Errors = require('./errors');
var Types = require('./lib/types');
var Position = require('./position');

var Piece = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.name != 'string'
    || R.not(R.is(Position, opts.position))) {
    throw new Errors.TypeClassError('Invalid Piece options.');
  }
  for (k in opts) { this[k] = opts[k] };
}

var checkType = Types.check(Piece);

module.exports = Piece;

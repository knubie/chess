var R = require('ramda');
var Errors = require('../errors');
var Piece = require('./Piece');

var Board = function(opts) {
  if ( typeof opts !== 'object'
    || typeof opts.size !== 'number'
    || opts.pieces == null) {
    throw new Errors.TypeClassError('Invalid Board options.');
  }
  if (R.any(R.compose(R.not, R.is(Piece)), opts.pieces)) {
    throw new Errors.TypeClassError('Invalid type.');
  }
  for (k in opts) { this[k] = opts[k] };
}

module.exports = Board;

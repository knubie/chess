var R = require('ramda');
var Errors = require('../errors');
var Position = require('./Position');

var Piece = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.name != 'string'
    || typeof opts.color != 'string'
    || R.not(R.is(Position, opts.position))) {
    throw new Errors.TypeClassError('Invalid Piece options.');
  }
  for (k in opts) { this[k] = opts[k] };
  var pieces = {
    'rook': {
      parlett: [{
        direction: '+',
        distance: 'n'
      }]
    }
  };
  this.parlett = pieces[opts.name].parlett
}

module.exports = Piece;

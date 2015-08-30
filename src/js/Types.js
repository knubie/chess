var R = require('ramda');
var Errors = require('./Errors');
for (k in R) { global[k] = R[k]; }

// Board { size :: Number, pieces :: [Piece] }
var Board = function(opts) {
  if ( typeof opts !== 'object'
    || typeof opts.size !== 'number'
    || opts.pieces == null) {
    throw new Errors.TypeClassError('Invalid Board options.');
  }
  if (any(compose(not, is(Piece)), opts.pieces)) {
    throw new Errors.TypeClassError('Invalid type.');
  }
  for (k in opts) { this[k] = opts[k] };
}

// Piece { name :: String, color :: String, position :: Position }
var Piece = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.name != 'string'
    || typeof opts.color != 'string'
    || not(is(Position, opts.position))) {
    throw new Errors.TypeClassError('Invalid Piece options.');
  }
  for (k in opts) { this[k] = opts[k] };
  var pieces = {
    'rook': {
      parlett: [{
        direction: '+',
        distance: 'n'
      }]
    },
    'bishop': {
      parlett: [{
        direction: 'X',
        distance: 'n'
      }]
    }
  };
  this.parlett = pieces[opts.name].parlett
}

// Position { x :: Number, y :: Number }
var Position = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.x != 'number'
    || typeof opts.y != 'number') {
    throw new Errors.TypeClassError('Invalid Position options.');
  }
  for (k in opts) { this[k] = opts[k] };
}

module.exports = { Board: Board, Piece: Piece, Position: Position };

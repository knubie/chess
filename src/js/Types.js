var R = require('ramda');
var Errors = require('./Errors');
for (k in R) { global[k] = R[k]; }

// TODO: R.assoc break this patter because it copies prototypes as well.
// will need to assign the opts obj onto a this.__value member to avoid that.

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
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
}

Board.of = function(x) { return new Board(x); };
//Board.prototype.map = function(f){
  //return Board.of(f(this))
//}

// Piece { name :: String, color :: String, position :: Position }
var Piece = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.name != 'string'
    || typeof opts.color != 'string'
    || not(is(Position, opts.position))) {
    throw new Errors.TypeClassError('Invalid Piece options.');
  }
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
  var pieces = {
    'rook': {
      parlett: [{
        moveType: 'default',
        direction: '+',
        distance: 'n'
      }]
    },
    'bishop': {
      parlett: [{
        moveType: 'default',
        direction: 'X',
        distance: 'n'
      }]
    },
    'queen': {
      parlett: [
        {
          moveType: 'default',
          direction: 'X',
          distance: 'n'
        },
        {
          moveType: 'default',
          direction: '+',
          distance: 'n'
        }
      ]
    },
  };
  this.parlett = pieces[opts.name].parlett
}

Piece.of = function(x) { return new Piece(x); };
//Piece.prototype.map = function(f){
  //return Piece.of(f(this))
//}

// Position { x :: Number, y :: Number }
var Position = function(opts) {
  if (typeof opts != 'object'
    || typeof opts.x != 'number'
    || typeof opts.y != 'number') {
    throw new Errors.TypeClassError('Invalid Position options.');
  }
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
}

Position.of = function(x) { return new Position(x); };
//Position.prototype.map = function(f){
  //return Position.of(f(this))
//}

module.exports = { Board: Board, Piece: Piece, Position: Position };

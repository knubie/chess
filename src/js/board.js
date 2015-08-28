var R = require('ramda');
var Errors = require('./errors');

var checkTypeClass = function(obj) {
  if (!(obj instanceof Board)) {
    throw new Errors.TypeClassError('First argument must be instance of Board.');
  }
}
var Board = function(opts) {
  if ( typeof opts !== 'object'
    || typeof opts.size !== 'number'
    || opts.white == null
    || opts.black == null) {
    throw new Errors.TypeClassError('Invalid Board options.');
  }
  for (k in opts) { this[k] = opts[k] };
}

// pieces :: Board -> [Pieces]
Board.pieces = R.curry(function(_self) {
  checkTypeClass(_self);
  return Array.prototype.concat.call([], _self.white, _self.black);
});

// getPieceAtPosition :: (Board, Position) -> Maybe Piece
Board.getPieceAtPosition = R.curry(function(_self, position) {
  checkTypeClass(_self);
  return R.find(R.propEq('position', position), Board.pieces(_self));
});

// legalPosition :: (Board, Position) -> Boolean
Board.legalPosition = R.curry(function(_self, position) {
  checkTypeClass(_self);
  return position.x >= 0 && position.x < _self.size && position.y >= 0 && position.y < _self.size;
});

module.exports = Board;

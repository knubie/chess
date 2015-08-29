var R = require('ramda');
var Errors = require('./errors');
var Types = require('./lib/types');
var Piece = require('./piece');

var Board = function(opts) {
  if ( typeof opts !== 'object'
    || typeof opts.size !== 'number'
    || opts.white == null
    || opts.black == null) {
    throw new Errors.TypeClassError('Invalid Board options.');
  }
  if (R.any(R.compose(R.not, R.is(Piece)), R.concat(opts.white, opts.black))) {
    throw new Errors.TypeClassError('Invalid type.');
  }
  for (k in opts) { this[k] = opts[k] };
}

var checkType = Types.check(Board);

// pieces :: Board -> [Pieces]
Board.pieces = R.curry(function(_self) {
  checkType(_self);
  return R.concat(_self.white, _self.black);
});

// getPieceAtPosition :: (Board, Position) -> Maybe Piece
Board.getPieceAtPosition = R.curry(function(_self, position) {
  checkType(_self);
  return R.find(R.propEq('position', position), Board.pieces(_self));
});

// legalPosition :: (Board, Position) -> Boolean
Board.legalPosition = R.curry(function(_self, position) {
  checkType(_self);
  return position.x >= 0 && position.x < _self.size && position.y >= 0 && position.y < _self.size;
});

module.exports = Board;

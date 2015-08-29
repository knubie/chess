var R = require('ramda');
var Errors = require('./errors');
var Types = require('./lib/types');
var Piece = require('./piece');
var Position = require('./position');
var pieceLookup = require('./pieces');

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

var checkType = Types.check(Board);

// getPieceAtPosition :: (Board, Position) -> Maybe Piece
Board.getPieceAtPosition = R.curry(function(board, position) {
  checkType(board);
  return R.find(R.propEq('position', position), board.pieces);
});

// legalPosition :: (Board, Position) -> Boolean
Board.legalPosition = R.curry(function(board, position) {
  checkType(board);
  return position.x >= 0 && position.x < board.size && position.y >= 0 && position.y < board.size;
});

// movePiece :: (Board, Position, Position) -> Maybe Board
Board.movePiece = R.curry(function(board, startingPosition, endingPosition) {
  checkType(board);
  Types.check(Position, startingPosition);
  Types.check(Position, endingPosition);

  var piece = Board.getPieceAtPosition(board, startingPosition);

  if (piece === null) {
    return null;
  }

  var index = R.indexOf(piece, board.pieces);
  var pieces = R.remove(index, 1, board.pieces);

  var possibleMoves = move.getMoves(board, startingPosition, pieceLookup[piece.name].parlett);

  if (R.not(R.any(R.equals(endingPosition), possiblemoves))) {
    return null;
  }

  var newPiece = new Piece({ name: piece.name, position: endingPosition, color: piece.color });
  var newPieces = R.append(newPiece, pieces);

  return new Board({ size: board.size, pieces: newPieces });
});

module.exports = Board;

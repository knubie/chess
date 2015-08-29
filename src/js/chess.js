var R        = require('ramda');
var Errors   = require('./errors');
var Types    = require('./lib/types');
var Board    = require('./types/Board');
var Piece    = require('./types/Piece');
var Position = require('./types/Position');

//  orthogonal :: (Maybe String, Either String | Number, Board, Position) -> [Position]
var orthogonal = R.curry(function(direction, distance, board, position) {
  distance = distance === 'n' ? board.size - 1 : parseInt(distance);

  var getPosition = R.curry(function(axis, i) {
    return {
      x: (axis === 'x') ? i : position.x,
      y: (axis === 'y') ? i : position.y
    };
  });

  // Filter out falsey values.
  // The identity returns its parameter,
  // hence if parameter is falsey it will return falsey.
  return R.filter(R.identity, R.flatten(
    R.map(function(axis) {
      var min = Math.max(position[axis] - distance, 0)
      var max = Math.min(position[axis] + distance + 1, board.size)
      return R.map(function(i) {
        var inBetween = i < position[axis]
                      ? R.range(i, position[axis])
                      : R.range(position[axis] + 1, i + 1);

        var blockingPieces = R.any(
          R.compose(
            getPieceAtPosition(board),
            getPosition(axis)
          ), inBetween);

        // TODO: moveType check
        if (blockingPieces) {
          // TODO: check if piece is opposite color, add to captures
          return false; // Gets filtered out.
        } else {
          return getPosition(axis, i);
        }
      }, R.concat(R.range(min, position[axis]), R.range(position[axis] + 1, max)));
    }, ['x', 'y'])
  ));
});

var directions = {
  '+': orthogonal(null),
  //'+': R.converge(R.concat, orthogonal('forwards'),orthogonal('backwards'),orthogonal('sideways')),
  '>': orthogonal('forwards'),
  '<': orthogonal('backwards'),
  '=': orthogonal('sideways'),
  '<>': R.converge(R.concat, orthogonal('forwards'), orthogonal('backwards')),
  '>=': R.converge(R.concat, orthogonal('forwards'), orthogonal('sideways')),
  '<=': R.converge(R.concat, orthogonal('backwards'), orthogonal('sideways'))
};

//  getPieceAtPosition :: (Board, Position) -> Maybe Piece
var getPieceAtPosition = R.curry(function(board, position) {
  return R.find(R.propEq('position', position), board.pieces);
});

//  legalPosition :: (Board, Position) -> Boolean
var legalPosition = R.curry(function(board, position) {
  return position.x >= 0 && position.x < board.size && position.y >= 0 && position.y < board.size;
});

//  getMoves :: (Board, Piece) -> [Position]
var getMoves = R.curry(function(board, piece) {
  //R.compose(R.uniq, R.flatten, R.map)
  return R.uniq(R.flatten(R.map(function(p) {
    return directions[p.direction](p.distance, board, piece.position);
  }, piece.parlett)));
});

//  movePiece :: (Board, Position, Position) -> Maybe Board
var movePiece = R.curry(function(board, startingPosition, endingPosition) {
  var piece = getPieceAtPosition(board, startingPosition);
  if ( R.any(R.equals(endingPosition), getMoves(board, piece)) ) {
    var index = R.indexOf(piece, board.pieces);
    var pieces = R.remove(index, 1, board.pieces);
    var newPiece = new Piece({ name: piece.name, position: endingPosition, color: piece.color });
    var newPieces = R.append(newPiece, pieces);
    return new Board({ size: board.size, pieces: newPieces });
  } else {
    return null;
  }
});

module.exports = { movePiece: movePiece, getMoves: getMoves };

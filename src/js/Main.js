var R        = require('ramda');
var check    = require('./lib/type-checker').checkAll;
// var {Board, Piece, Position} = require('./Types');
var Board    = require('./Types').Board;
var Piece    = require('./Types').Piece;
var Position = require('./Types').Position;

for (k in R) { global[k] = R[k]; }
var concatAll = unapply(reduce(concat, []));

//  orthogonal :: (String, Either String | Number, Board, Piece) -> [Position]
var orthogonal = curry(function(direction, distance, board, piece) {
  check(arguments, [String, [String, Number], Board, Piece]);
  distance = distance === 'n' ? board.size - 1 : parseInt(distance);
  var position = piece.position;
  var forwards = direction === 'forwards';
  var backwards = direction === 'backwards';
  var sideways = direction === 'sideways';
  var white = piece.color === 'white';
  var black = not(white);
  var axis = (forwards || backwards) ? 'y' : 'x';

  var getPosition = curry(function(axis, i) {
    return new Position({
      x: (axis === 'x') ? i : position.x,
      y: (axis === 'y') ? i : position.y
    });
  });

  var min = Math.max(position[axis] - distance, 0);
  var max = Math.min(position[axis] + distance + 1, board.size);
  if ( (forwards && white) || (backwards && black) ) {
    var min = position[axis];
  } else if ( (backwards && white) || (forwards && black) ) {
    var max = position[axis] + 1;
  }

  // Filter out falsey values.
  // The identity returns its parameter,
  // hence if parameter is falsey it will return falsey.
  return filter(identity, map(function(i) {
    var inBetween = i < position[axis]
                  ? range(i + 1, position[axis])
                  : range(position[axis] + 1, i);

    // compose is broken in v16 or v17...
    //var blockingPieces = any(
      //compose(
        //getAnyPieceAtPosition(board),
        //getPosition(axis)
      //), inBetween);
    var blockingPieces = any(function(i) {
      return getAnyPieceAtPosition(board, getPosition(axis, i));
    }, inBetween);

    // TODO: moveType check
    if (blockingPieces || getPieceAtPosition(board, piece.color, getPosition(axis, i))) {
      // TODO: check if piece is opposite color, add to captures
      return null; // Gets filtered out.
    } else {
      return getPosition(axis, i);
    }
  }, concat(range(min, position[axis]), range(position[axis] + 1, max))));
});

var diagonal = curry(function(direction, distance, board, piece) {
  check(arguments, [String, [String, Number], Board, Piece]);
  distance = distance === 'n' ? board.size - 1 : parseInt(distance);
  var position = piece.position;
  var forwards = direction === 'forwards';
  var backwards = direction === 'backwards';
  var white = piece.color === 'white';
  var black = not(white);

  var move = curry(function(x, y, i) {
    var pos = new Position({
      x: x(position.x, i),
      y: y(position.x, i)
    });
    var blockingPieces = any(function(j) {
      return getAnyPieceAtPosition(board, new Position({
        x: x(position.x, i - j),
        y: y(position.y, i - j)
      }));
    }, range(1, i));
    if (getAnyPieceAtPosition(board, pos) || blockingPieces) {
      return null;
    } else {
      return pos;
    }
  });
  // forwards && white
  if ((forwards && white) || (backwards && black)) {
    return filter(legalPosition(board), filter(identity, converge(
      concatAll,
        map(move(add, add)),
        map(move(subtract, add))
    )(range(1, distance + 1))));
  } else if ( (forwards && black) || (backwards && white)) {
  // backwards && white
    return filter(legalPosition(board), filter(identity, converge(
      concatAll,
        map(move(subtract, subtract)),
        map(move(add, subtract))
    )(range(1, distance + 1))));
  }

});

var directions = {
  '+': converge(concatAll, orthogonal('sideways'), orthogonal('backwards'), orthogonal('forwards')),
  '>': orthogonal('forwards'),
  '<': orthogonal('backwards'),
  '=': orthogonal('sideways'),
  '<>': converge(concat, orthogonal('forwards'), orthogonal('backwards')),
  '>=': converge(concat, orthogonal('forwards'), orthogonal('sideways')),
  '<=': converge(concat, orthogonal('backwards'), orthogonal('sideways')),
  'X': converge(concat, diagonal('forwards'), diagonal('backwards')),
  'X>': diagonal('forwards'),
  'X<': diagonal('backwards')
};

//  getPieceAtPosition :: (Board, String, Position) -> Maybe Piece
var getPieceAtPosition = curry(function(board, color, position) {
  check(arguments, [Board, String, Position]);
  var positionAndColor = both(propEq('position', position), propEq('color', color));
  return find(positionAndColor, board.pieces);
});

//  getAnyPieceAtPosition :: (Board, Position) -> Maybe Piece
var getAnyPieceAtPosition = either(
  getPieceAtPosition(__, 'white', __),
  getPieceAtPosition(__, 'black', __)
);

//  legalPosition :: (Board, Position) -> Boolean
var legalPosition = curry(function(board, position) {
  check(arguments, [Board, Position]);
  return position.x >= 0 && position.x < board.size && position.y >= 0 && position.y < board.size;
});

//  getMoves :: (Board, Piece) -> [Position]
var getMoves = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  //compose(uniq, flatten, map)
  return uniq(flatten(map(function(p) {
    return directions[p.direction](p.distance, board, piece);
  }, piece.parlett)));
});

//  getCaptures :: (Board, Piece) -> [Position]
var getCaptures = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  var color = piece.color == 'white' ? 'black' : 'white';
  return filter(getPieceAtPosition(board, color), getMoves(board, piece));
});

//  movePiece :: (Board, Position, Position) -> Maybe Board
var movePiece = curry(function(board, startingPosition, endingPosition) {
  check(arguments, [Board, Position, Position]);
  //compose(getMoves(board), getAnyPieceAtPosition)(board, startingPosition);
  //getMoves(board, getAnyPieceAtPosition(board, startingPosition))
  var piece = getAnyPieceAtPosition(board, startingPosition);
  if (contains(endingPosition, getMoves(board, piece))) {
    return new Board({
      size: board.size,
      pieces: adjust(always(
        new Piece(assoc('position', endingPosition, piece))
      ), indexOf(piece, board.pieces), board.pieces)
    });
  } else {
    return null;
  }
});

module.exports = { movePiece: movePiece, getMoves: getMoves, getCaptures: getCaptures };

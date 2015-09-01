var R        = require('ramda');
var check    = require('./lib/type-checker').checkAll;
// var {Board, Piece, Position} = require('./Types');
var Board    = require('./Types').Board;
var Piece    = require('./Types').Piece;
var Position = require('./Types').Position;

for (var k in R) { global[k] = R[k]; }
var concatAll = unapply(reduce(concat, []));

//  between :: (Number, Number) -> [Number]
var between = curry(function(start, end) {
  check(arguments, [Number, Number]);
  return start < end ? range(start + 1, end) : range(end + 1, start);
});

//  orthogonal :: (String, Either String | Number, Board, Piece) -> [Position]
var orthogonal = curry(function(direction, distance, board, piece) {
  check(arguments, [String, [String, Number], Board, Piece]);

  distance = distance === 'n' ? board.size - 1 : parseInt(distance);
  var forwards = direction === 'forwards';
  var backwards = direction === 'backwards';
  var sideways = direction === 'sideways';
  var white = piece.color === 'white';
  var black = not(white);
  var axis = (forwards || backwards) ? 'y' : 'x';

  var minD = max(piece.position[axis] - distance, 0);
  var maxD = min(piece.position[axis] + distance + 1, board.size);
  if ( (forwards && white) || (backwards && black) ) {
    minD = piece.position[axis];
  } else if ( (backwards && white) || (forwards && black) ) {
    maxD = piece.position[axis] + 1;
  }

  // TODO: only check orthogonalBlocking if piece is not a jumper
  return reject(getPieceAtPosition(board, piece.color),
                map(compose(Position.of, assoc(axis, __, piece.position)),
                    concat(range(minD, piece.position[axis]),
                           range(piece.position[axis] + 1, maxD))));
});

//  getOrthogonalBlocking :: (Board, Piece, Position) -> Boolean
var getOrthogonalBlocking = curry(function(board, piece, position) {
  check(arguments, [Board, Piece, Position]);

  var axis = position.x === piece.position.x ? 'y' : 'x';
  //// compose is broken in v16 or v17...
  //return any(
    //compose(
      //getAnyPieceAtPosition(board),
      ////getPosition(axis)
      //compose(Position.of, assoc(axis, __, piece.position))
    //), between(position[axis], piece.position[axis]));
  return any(function(j) {
    return getAnyPieceAtPosition(board,
             Position.of(assoc(axis, j, piece.position)));
  }, between(position[axis], piece.position[axis]));
});

//  diagonal :: (String, Either String | Number, Board, Piece) -> [Position]
var diagonal = curry(function(direction, distance, board, piece) {
  check(arguments, [String, [String, Number], Board, Piece]);
  distance = distance === 'n' ? board.size - 1 : parseInt(distance);
  var position = piece.position;
  var forwards = direction === 'forwards';
  var backwards = direction === 'backwards';
  var white = piece.color === 'white';
  var black = not(white);

  var move = curry(function(x, y, i) {
    return new Position({
      x: x(position.x, i),
      y: y(position.x, i)
    });
  });
  // forwards && white
  if ((forwards && white) || (backwards && black)) {
    return reject(getPieceAtPosition(board, piece.color),
           filter(legalPosition(board),
    converge(
      concatAll,
        map(move(add, add)),
        map(move(subtract, add))
    )(range(1, distance + 1))));

  // backwards && white
  } else if ( (forwards && black) || (backwards && white)) {
    return reject(getPieceAtPosition(board, piece.color),
           filter(legalPosition(board),
    converge(
      concatAll,
        map(move(subtract, subtract)),
        map(move(add, subtract))
    )(range(1, distance + 1))));
  }
});

//  getDiagonalBlocking :: (Board, Piece, Position) -> Boolean
var getDiagonalBlocking = curry(function(board, piece, position) {
  check(arguments, [Board, Piece, Position]);
  var x = position.x > piece.position.x ? add : subtract;
  var y = position.y > piece.position.y ? add : subtract;
  var index = Math.abs(position.x - piece.position.x);
  return any(function(j) {
    return getAnyPieceAtPosition(board, new Position({
      x: x(piece.position.x, index - j),
      y: y(piece.position.y, index - j)
    }));
  }, range(1, index));
});

//  hippogonal :: (Number, Number, Number, Board, Piece) -> [Position]
var hippogonal = curry(function(distance1, distance2, numMoves, board, piece) {
  return [
    new Position({
      x: piece.position.x + distance1,
      y: piece.position.y + distance2
    }),
    new Position({
      x: piece.position.x + distance2,
      y: piece.position.y + distance1
    }),
    new Position({
      x: piece.position.x - distance1,
      y: piece.position.y - distance2
    }),
    new Position({
      x: piece.position.x - distance2,
      y: piece.position.y - distance1
    }),

    new Position({
      x: piece.position.x + distance1,
      y: piece.position.y - distance2
    }),
    new Position({
      x: piece.position.x + distance2,
      y: piece.position.y - distance1
    }),
    new Position({
      x: piece.position.x - distance1,
      y: piece.position.y + distance2
    }),
    new Position({
      x: piece.position.x - distance2,
      y: piece.position.y + distance1
    })
  ]
});

var getHippogonalFunction = curry(function(notation) {
  var d1 = notation.match(/(\d)\/(\d)/)[1];
  var d2 = notation.match(/(\d)\/(\d)/)[2];
  return hippogonal(parseInt(d1), parseInt(d2));
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

var movementTypes = {
  'orthogonal': orthogonal,
  'diagonal': diagonal
}

var jumperTypes = {
  '~': function(movement) { return movement; },
  'default': function(movementType, board, piece) {
    if (movementType === 'orthogonal') {
      return compose(
        reject(getOrthogonalBlocking(board, piece)),
        orthogonal(__, __, board, piece));
    } else if (movementType === 'diagonal') {
      return compose(
        reject(getDiagonalBlocking(board, piece)),
        diagonal(__, __. board, piece));
    }
  }
}

//jumperTypes[p.jumperType](p.movementType, board, piece)(p.direction, p.distance)

//  getMoves :: (Board, Piece) -> [Position]
var getMoves = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  //compose(uniq, flatten, map)
  return uniq(flatten(map(function(p) {
    if (p.moveType === 'default' && contains(p.direction, ['+', '>', '<', '<>', '=', '>=', '<='])) {
      //reject(getOrthogonalBlocking(board, piece)),
      //return converge(reject, getOrthogonalBlocking,
                              //directions[p.direction](p.distance))(board, piece);
      return reject(getOrthogonalBlocking(board, piece),
                    directions[p.direction](p.distance, board, piece));
    } else if (p.moveType === 'default' && contains(p.direction, ['X', 'X>', 'X<'])) {
      return reject(getDiagonalBlocking(board, piece),directions[p.direction](p.distance, board, piece));
    } else if ( (/\d+\/\d+/).test(p.direction) ) {
      return getHippogonalFunction(p.direction)(p.distance, board, piece);
    } else {
      return directions[p.direction](p.distance, board, piece);
    }
    //return directions[p.direction](p.distance, board, piece);
  }, piece.parlett)));
});

//  getCaptures :: (Board, Piece) -> [Position]
var getCaptures = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  var color = piece.color === 'white' ? 'black' : 'white';
  return filter(getPieceAtPosition(board, color), getMoves(board, piece));
});

//  movePiece :: (Board, Position, Position) -> Maybe Board
var movePiece = curry(function(board, startingPosition, endingPosition) {
  check(arguments, [Board, Position, Position]);
  //compose(getMoves(board), getAnyPieceAtPosition)(board, startingPosition);
  //getMoves(board, getAnyPieceAtPosition(board, startingPosition))
  // if (piece.color === game.turn) {
  // } else {
  //   return null;
  // }
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

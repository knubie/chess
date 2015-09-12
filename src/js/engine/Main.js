var R        = require('ramda');
var check    = require('./lib/type-checker').checkAll;
// var {Board, Piece, Position} = require('./Types');
var Board    = require('./Types').Board;
var Piece    = require('./Types').Piece;
var Position = require('./Types').Position;

for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}
var concatAll = unapply(reduce(concat, []));

//  between :: (Number, Number) -> [Number]
var between = curry(function(start, end) {
  check(arguments, [Number, Number]);
  return start < end ? range(start + 1, end) : range(end + 1, start);
});

//  hippogonal :: (Number, Number, Number, Board, Piece) -> [Position]
var hippogonal = curry(function(distance1, distance2, numMoves, direction, board, piece) {
  var oppositeColor = piece.color === 'white' ? 'black' : 'white';

  // TODO: Add support for x(n/n).

  //distance = distance === 'n' ? board.size - 1 : parseInt(distance);
  var forwards = direction === 'forwards';
  var backwards = direction === 'backwards';
  var sideways = direction === 'sideways';
  var white = piece.color === 'white';
  var black = not(white);

  return uniq(filter(identity, flatten(
    map(function(fns) {
      var i = 1;
      var fn = function(pos) {
        var p = Position.of(evolve({
          x: fns[0],
          y: fns[1]
        }, pos));
        var wrongDirection = (  ( ((forwards && white) || (backwards && black)) && (p.y <= piece.position.y)) ||
          ( ((backwards && white) || (forwards && black)) && (p.y >= piece.position.y))  ||
          (sideways && (p.y !== piece.position.y))  )
        if (legalPosition(board, p) && !wrongDirection && !getPieceAtPosition(board, piece.color, p)) {
          if (getPieceAtPosition(board, oppositeColor, p)) {
            return p;
          } else {
            if ( numMoves === 'n' || i < numMoves) {
              i = i + 1;
              return [p, fn(p)];
            } else {
              return p;
            }
          }
        } else {
          return null;
        }
      }
      return fn(piece.position);
    }, [
      [add(distance1),          add(distance2)],
      [add(distance2),          add(distance1)],
      [subtract(__, distance1), subtract(__, distance2)],
      [subtract(__, distance2), subtract(__, distance1)],
      [add(distance1),          subtract(__, distance2)],
      [add(distance2),          subtract(__, distance1)],
      [subtract(__, distance1), add(distance2)],
      [subtract(__, distance2), add(distance1)]
    ])
  )));
});

//  getPieceAtPosition :: (Board, String, Position) -> Maybe Piece
var getPieceAtPosition = curry(function(board, color, position) {
  check(arguments, [Board, String, Position]);
  //var positionAndColor = where({position: equals(position), color: equals(color)});
  var positionAndColor = both(propEq('position', position), propEq('color', color));
  return find(positionAndColor, board.pieces);
});

//  getAnyPieceAtPosition :: (Board, Position) -> Maybe Piece
var getAnyPieceAtPosition = curry(function(board, position) {
  return getPieceAtPosition(board, 'white', position) ||
         getPieceAtPosition(board, 'black', position)
});

//  legalPosition :: (Board, Position) -> Boolean
var legalPosition = curry(function(board, position) {
  check(arguments, [Board, Position]);
  return position.x >= 0 && position.x < board.size && position.y >= 0 && position.y < board.size;
});

//  getMoves :: (Board, Piece) -> [Position]
var getMoves = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  var oppositeColor = piece.color === 'white' ? 'black' : 'white';
  var initial = function(p) {
    return contains('i', or(p.conditions, [])) && parseInt(piece.moves) > 0;
  }
  return uniq(flatten(map(function(p) {
    var d = map(parseInt, p.movement.match(/(\d)\/(\d)/));
    var results = hippogonal(d[1], d[2], p.distance, p.direction, board, piece);
    if ( contains('c', or(p.conditions, [])) ) {
      return filter(getPieceAtPosition(board, oppositeColor), results);
    } else if ( contains('o', or(p.conditions, [])) ) {
      return reject(getPieceAtPosition(board, oppositeColor), results);
    } else {
      return results
    }
  }, reject(initial, piece.parlett))));
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
  var capturedPiece = getAnyPieceAtPosition(board, endingPosition);
  var newPosition = always(endingPosition);
  // FIXME: This seems wrong. It will only work if all 'gun' pieces have
  // conditions: ['c'] with every moveType: 'gun' entry, and
  // conditions: ['o'] for every non-gun moveType entry.
  if (capturedPiece && any(propEq('moveType', 'gun'), piece.parlett)) {
    newPosition = always(startingPosition);
  }
  if (contains(endingPosition, getMoves(board, piece))) {
    return new Board({
      size: board.size,
      pieces: reject(equals(capturedPiece),
                     adjust(compose(
                       Piece.of,
                       evolve({
                         position: newPosition,
                         moves: add(1) }))
                     , indexOf(piece, board.pieces)
                     , board.pieces))
    });
  } else {
    return null;
  }
});

//  isGameOver :: (Board, String) -> Maybe Boolean
var isGameOver = curry(function(board, color) {
  return not(any(where({
                   color: equals(color),
                   royal: equals(true)
                 }), board.pieces));
});

//  addPiece :: ([Piece], Piece) -> [Piece]
var addPiece = curry(function(pieces, piece) {
  return append(piece, reject(propEq('position', piece.position), pieces))
});

//  

module.exports = { movePiece: movePiece, getMoves: getMoves, getCaptures: getCaptures, addPiece: addPiece };

var R        = require('ramda');
var check    = require('./lib/type-checker').checkAll;
var Game     = require('./Types').Game;
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

//  isCapturable :: (Maybe(Piece)) -> Boolean
var isCapturable = curry(function(piece) {
  // FIXME: add Maybe support
  return not(contains('invincible', prop('types', piece || {types: []})));
});

//  move :: (Number, Number, String, String, Board, Piece) -> [Position]
var move = curry(function(distance1, distance2, numMoves, direction, board, piece) {
  check(arguments, [Number, Number, String, String, Board, Piece]);
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
        var wrongDirection = ((((forwards && white) || (backwards && black)) && (p.y <= piece.position.y)) ||
          (((backwards && white) || (forwards && black)) && (p.y >= piece.position.y))  ||
          (sideways && (p.y !== piece.position.y)))
        if (legalPosition(board, p) &&
            !wrongDirection &&
            !getPieceAtPosition(board, piece.color, p) &&
            isCapturable(getAnyPieceAtPosition(board, p))) {
          if (getPieceAtPosition(board, oppositeColor, p)) {
            return p;
          } else {
            if (numMoves === 'n' || i < parseInt(numMoves)) {
              i = i + 1;
              return [p, fn(p)];
            } else {
              return p;
            }
          }
        } else {
          return null;
        }
      };
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

var castling = curry(function(board, piece) {

});

//  getPieceAtPosition :: (Board, String, Position) -> Maybe Piece
var getPieceAtPosition = curry(function(board, color, position) {
  check(arguments, [Board, String, Position]);
  var positionAndColor = both(propEq('position', position), propEq('color', color));
  return find(positionAndColor, board.pieces);
});

//  getAnyPieceAtPosition :: (Board, Position) -> Maybe Piece
var getAnyPieceAtPosition = curry(function(board, position) {
  check(arguments, [Board, Position]);
  return getPieceAtPosition(board, 'white', position) ||
         getPieceAtPosition(board, 'black', position);
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
  };

  if (customMovement[piece.name]) {
    return customMovement[piece.name](board, piece);
  } else {
    return uniq(flatten(map(function(p) {
      var d = map(parseInt, p.movement.match(/(\d)\/(\d)/));
      var direction = p.direction || 'any';
      var results = move(d[1], d[2], p.distance, direction, board, piece);
      if (contains('c', or(p.conditions, []))) {
        return filter(getPieceAtPosition(board, oppositeColor), results);
      } else if (contains('o', or(p.conditions, []))) {
        return reject(getPieceAtPosition(board, oppositeColor), results);
      } else {
        return results;
      }
    }, reject(initial, piece.parlett))));
  }
});

//  getCaptures :: (Board, Piece) -> [Position]
var getCaptures = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  var color = piece.color === 'white' ? 'black' : 'white';
  return filter(getPieceAtPosition(board, color), getMoves(board, piece));
});

var pieceCallbacks = {
  teleporter: {
    // onCapture :: (Piece, Piece, Piece, Board) -> Board
    onCapture: curry(function(oldPiece, piece, capturedPiece, board) {
      return addPieceToBoard(Piece.of(evolve({
        position: always(oldPiece.position)
      }, capturedPiece)), board);
    })
  },
  bloodlust: {
    // onCapture :: (Piece, Piece, Piece, Board) -> Board
    onCapture: curry(function(oldPiece, piece, capturedPiece, board) {
      check(arguments, [Piece, Piece, Piece, Board]);
      return Board.of(evolve({
        pieces: adjust(
                  compose(
                    Piece.of,
                    evolve({
                      // TODO: Make this less ugly.
                      parlett: map(evolve({ distance: compose(
                                                        add(''),
                                                        add(1),
                                                        parseInt,
                                                        // FIXME: why is this necessary??
                                                        add('')) })) })),
                  indexOf(piece, board.pieces))
      }, board));
    })
  },
  shapeshifter: {
    // onCapture :: (Piece, Piece, Board) -> Board
    onCapture: curry(function(oldPiece, piece, capturedPiece, board) {
      check(arguments, [Piece, Piece, Piece, Board]);
      var newPiece = Piece.of(evolve({
        color: always(piece.color),
        moves: always(piece.moves),
        captures: always(piece.captures),
        parlett: always(capturedPiece.parlett)
      }, capturedPiece))
      return Board.of(evolve({
        pieces: adjust(
                  always(newPiece),
                  indexOf(piece, board.pieces))
      }, board));
    })
  },
  bomber: {
    ability: curry(function(piece, board) {
      var surroundingPieces = [];
      return Board.of(evolve({
        pieces: reject(
                  comspose(
                    any(__, surroundingPieces),
                    equals))
      }, board));
    }),
    onCaptured: curry(function(piece, board) {
      // piece = the captured piece.
      // TODO: Change getMoves to actual blast radius.
      return Board.of(evolve({
        pieces: reject(
          compose(
            flip(contains( append(piece.position, getMoves(board, piece)) )),
            prop('position')
          )
        )
      }, board));
    }),

    // onCapture :: (Piece, Piece, Board) -> Board
    onCapture: curry(function(oldPiece, piece, capturedPiece, board) {
      check(arguments, [Piece, Piece, Piece, Board]);
      return board;
    })
  },
  mine: {
    afterEveryPly: curry(function(game, piece) {
      var index = piece.color === 'white' ? 0 : 1;
      return Game.of(evolve({
        resources: adjust(add(1), index) // Add one to resources of same color as piece.
      }, game));
    })
  }
};
var customMovement = {
  'teleporter': function(board, piece) {
    // Get all squares
    var positions = flatten(map(function(x) {
      return map(function(y) {
        return Position.of({x:x, y:y});
      }, range(0, board.size))
    }, range(0, board.size)));
    // Filter squares that don't have pieces, or have a piece of the same color.
    // TODO: filter out current piece's position as well.
    return filter(function(pos) {
      var p = getAnyPieceAtPosition(board, pos)
      return (not(p) || prop('color', p || {color: null}) === piece.color);
    }, positions);
  }
}

//  makePly :: (String, Game, Object) -> Maybe Game
var makePly = curry(function(plyType, game, opts) {
  var newGame = null;
  switch (plyType) {
    case 'move':
      var startingPosition = opts.startingPosition
        , targetPosition = opts.targetPosition;
      check([startingPosition, targetPosition], [Position, Position]);
      var piece = getAnyPieceAtPosition(game.board, startingPosition);
      if (equals(startingPosition, targetPosition) ||
          not(equals(piece.color, game.turn)) ||
          // movePiece returns null if it's not a valid targetPosition
          not(movePiece(startingPosition, targetPosition, game.board))) {
        // TODO: Add message.
        newGame = game;
      } else {
        newGame = Game.of(evolve({
          board: movePiece(startingPosition, targetPosition),
          turn: function(turn) { return turn === 'white' ? 'black' : 'white'; },
          plys: append([startingPosition, targetPosition])
        }, game));
      }
    case 'ability':
    case 'draft':
  }
  var piecesWithAfterEveryPlyCallback = filter(
    compose(
      path(__, pieceCallbacks),
      prepend(__, ['afterEveryPly']),
      prop('name')
    )
  , newGame.board.pieces);
  var piecesWithAfterEveryPlyCallbackAndColor = filter(
  propEq('color', game.turn)
  , piecesWithAfterEveryPlyCallback);

  return reduce(function(game, piece) {
    return path([piece.name, 'afterEveryPly'], pieceCallbacks)(game, piece);
  }, newGame, piecesWithAfterEveryPlyCallbackAndColor);

  //return afterEveryPlyCallback(piecesWithAfterEveryPlyCallbackAndColor[0], newGame);
});

//  movePiece :: (Position, Position, Board) -> Maybe Board
var movePiece = curry(function(startingPosition, targetPosition, board) {
  check(arguments, [Position, Position, Board]);

  var piece = getAnyPieceAtPosition(board, startingPosition);
  var capturedPiece = getAnyPieceAtPosition(board, targetPosition);
  var newPosition = always(targetPosition);
  if (capturedPiece && contains('ranged', piece.types)) {
    newPosition = always(startingPosition);
  }

  //TODO implement teleporter
  var onCapture = capturedPiece &&
                  path([piece.name, 'onCapture'], pieceCallbacks) ||
                  curry(function(oldPiece, piece, capturedPiece, board) { return board; });
  var onCaptured = capturedPiece &&
                   path([capturedPiece.name, 'onCaptured'], pieceCallbacks) ||
                   curry(function(piece, board) { return board; });

  if (contains(targetPosition, getMoves(board, piece))) {
    var newPiece = Piece.of(evolve({
      position: newPosition,
      moves: add(1),
    }, piece));
    var newBoard = Board.of(evolve({
      pieces: compose(
                reject(equals(capturedPiece)),
                adjust(
                  always(newPiece),
                  indexOf(piece, board.pieces)))
    }, board));
    return compose(
      onCaptured(capturedPiece),
      onCapture(piece, newPiece, capturedPiece)
    )(newBoard);
  } else {
    // TODO: return message
    return null;
  }
});

//  isGameOver :: (Board, String) -> Boolean
var isGameOver = curry(function(board, color) {
  check(arguments, [Board, String]);
  return not(any(where({
                   color: equals(color),
                   types: contains('royal')
                 }), board.pieces));
});

//  addPiece :: ([Piece], Piece) -> [Piece]
var addPiece = curry(function(pieces, piece) {
  check(arguments, [[Piece], Piece]);
  //compose(
    //append(piece),
    //reject(propEq('position', piece.position))
  //)
  return append(piece, reject(propEq('position', piece.position), pieces));
});

//  addPieceToBoard :: (Piece, Board) -> Board
var addPieceToBoard = curry(function(piece, board) {
  return Board.of(evolve({
    pieces: addPiece(__, piece)
  }, board));
});

// draftPiece :: (Game, Piece) -> Maybe Game
var draftPiece = curry(function(piece, game) {
  var index = piece.color === 'white' ? 0 : 1;
  if (piece.points <= game.resources[index]) {
    return Game.of(evolve({
      board: addPieceToBoard(piece),
      resources: adjust(subtract(__, piece.points), index)
    }, game));
  } else {
    return null;
  }
});

module.exports = {
  movePiece: movePiece,
  getMoves: getMoves,
  getCaptures: getCaptures,
  addPiece: addPiece,
  getPieceAtPosition: getPieceAtPosition,
  makePly: makePly,
  isGameOver: isGameOver,
  draftPiece: draftPiece,
};

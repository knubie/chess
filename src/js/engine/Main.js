var R        = require('ramda');
var check    = require('./lib/type-checker').checkAll;
var Cards   = require('./Cards');
var Types    = require('./Types');
var Game     = Types.Game;
var Board    = Types.Board;
var Piece    = Types.Piece;
var Position = Types.Position;

for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}

var MAX_GOLD = 10;

var concatAll = unapply(reduce(concat, []));

var shuffle = function(arr) {
  var array = arr.slice(0);
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
//  colorToIndex :: (String) -> Number
var colorToIndex = curry(function(color) {
  return color === 'white' ? 0 : 1;

});
//  between :: (Number, Number) -> [Number]
var between = curry(function(start, end) {
  check(arguments, [Number, Number]);
  return start < end ? range(start + 1, end) : range(end + 1, start);
});

//  message :: (String, Game) -> Game
var message = curry(function(message, game) {
  check(arguments, [String, Game]);
  return Game.of(assoc('message', message, game));
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

//  getDraftSquares :: (Board, String, String) -> [Position]
var getDraftSquares = curry(function(board, card, color) {
  // TODO: rewrite this, baking into the Pieces.js
  var moves = [];
  if (color === 'white') {
    var yStart = 0;
    var yEnd = 1;
    // TODO bake this into Pieces.js
    if (card === 'pawn' || card === 'berolina' || card === 'wall') {
      var yEnd = 2;
    }
    moves = flatten(map(function(y) {
      return map(function(x) {
        return Position.of({x: x, y: y});
      }, range(0, board.size));
    }, range(yStart, yEnd)));
  } else {
    var yStart = board.size;
    var yEnd = board.size - 1;
    if (card === 'pawn' || card === 'berolina' || card === 'wall') {
      var yEnd = board.size - 2;
    }
    moves = flatten(map(function(y) {
      return map(function(x) {
        return Position.of({x: x, y: y});
      }, range(0, board.size));
    }, range(yEnd, yStart)));
  }
  return reject(getAnyPieceAtPosition(board), moves);
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

//  getDefends :: (Board, Piece) -> [Position]
var getDefends = curry(function(board, piece) {
  check(arguments, [Board, Piece]);
  var color = piece.color === 'white' ? 'black' : 'white';
  return filter(getPieceAtPosition(board, piece.color), getMoves(board, Piece.of(evolve({color: always(color)}, piece))));
});

var pieceCallbacks = {
  perception: {
    use: curry(function(game) {
      var color = game.turn;
      var playerIndex = colorToIndex(color);
      var newGame = drawCard(color, game);
      if (!newGame.message) {
        newGame = drawCard(color, newGame);
        if (!newGame.message) {
          newGame = drawCard(color, newGame);
        }
      }
      return newGame;
    })
  },
  teleporter: {
    // onCapture :: (Piece, Piece, Piece, Game) -> Game
    onCapture: curry(function(oldPiece, piece, capturedPiece, game) {
      check(arguments, [Piece, Piece, Piece, Game]);
      return Game.of(evolve({
        board: addPieceToBoard(Piece.of(evolve({
                 position: always(oldPiece.position)
               }, capturedPiece)))
      }, game));
    })
  },
  bloodlust: {
    // onCapture :: (Piece, Piece, Piece, Game) -> Game
    onCapture: curry(function(oldPiece, piece, capturedPiece, game) {
      check(arguments, [Piece, Piece, Piece, Game]);
      return Game.of(evolve({
        board: compose(
                  Board.of,
                  evolve({
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
                                    indexOf(piece, game.board.pieces))
                        })
               )
      }, game));

    })
  },
  shapeshifter: {
    // onCapture :: (Piece, Piece, Game) -> Game
    onCapture: curry(function(oldPiece, piece, capturedPiece, game) {
      check(arguments, [Piece, Piece, Piece, Game]);
      var board = game.board;
      var newBoard;
      var newPiece = Piece.of(evolve({
        color: always(piece.color),
        moves: always(piece.moves),
        captures: always(piece.captures),
        parlett: always(capturedPiece.parlett)
      }, capturedPiece))
      newBoard = Board.of(evolve({
        pieces: adjust(
                  always(newPiece),
                  indexOf(piece, board.pieces))
      }, board));
      return Game.of(evolve({
        board: always(newBoard)
      }, game));
    })
  },
  bomber: {
    ability: curry(function(piece, game) {
      var surroundingSquares = [
        piece.position,
        Position.of({x: piece.position.x, y: piece.position.y - 1}),
        Position.of({x: piece.position.x + 1, y: piece.position.y - 1}),
        Position.of({x: piece.position.x + 1, y: piece.position.y}),
        Position.of({x: piece.position.x + 1, y: piece.position.y + 1}),
        Position.of({x: piece.position.x, y: piece.position.y + 1}),
        Position.of({x: piece.position.x - 1, y: piece.position.y + 1}),
        Position.of({x: piece.position.x - 1, y: piece.position.y}),
        Position.of({x: piece.position.x - 1, y: piece.position.y - 1}),
      ];
      return Game.of(evolve({
        board: compose(
                 Board.of,
                 evolve({
                   pieces: reject(
                             compose(
                               any(__, surroundingSquares),
                               equals,
                               prop('position')))
                 })
               )
      }, game));
      //return Board.of(evolve({
        //pieces: reject(
                  //compose(
                    //any(__, surroundingSquares),
                    //equals,
                    //prop('position')))
      //}, board));
    }),
    onCaptured: curry(function(piece, board) {
      // Removes any piece on the square of the captured piece.
      // piece = the captured piece.
      // TODO: Change getMoves to actual blast radius.
      return Board.of(evolve({
        pieces: reject(propEq('position', piece.position))
      }, board));
    })
  },
  king: {
    // TAX
    // Add one resource per pawn, or one
    ability: curry(function(piece, game) {
      var index = piece.color === 'white' ? 0 : 1;
      var amount = filter(where({
        name: equals('pawn'),
        color: equals(piece.color),
      }), game.board.pieces).length;
      return Game.of(evolve({
        resources: adjust(compose(min(MAX_GOLD), add(1), add(amount)), index) // Add one to resources of same color as piece.
      }, game));
    }),
  },
  mine: {
    ability: curry(function(piece, game) {
      var index = piece.color === 'white' ? 0 : 1;
      return Game.of(evolve({
        resources: adjust(compose(min(MAX_GOLD), add(1)), index) // Add one to resources of same color as piece.
      }, game));
    }),
    afterEveryPly: curry(function(game, piece) {
      var index = piece.color === 'white' ? 0 : 1;
      return Game.of(evolve({
        resources: adjust(compose(min(MAX_GOLD), add(1)), index) // Add one to resources of same color as piece.
      }, game));
    })
  },
  thief: {
    // onCapture :: (Piece, Piece, Game) -> Game
    onCapture: curry(function(oldPiece, piece, capturedPiece, game) {
      var index = piece.color === 'white' ? 0 : 1;
      return Game.of(evolve({
        resources: adjust(compose(min(MAX_GOLD), add(capturedPiece.points - 1)), index)
      }, game));
    })
  },
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
      return (not(p) || (not(equals(p, piece)) &&
              prop('color', p || {color: null}) === piece.color));
    }, positions);
  }
}

//  endTurn :: (PlyType, Game) -> Game
var endTurn = curry(function(ply, game) {
  return Game.of(evolve({
    turn: (turn) => { return turn === 'white' ? 'black' : 'white'; },
    plys: append(ply)
  }, game));
});

//  drawCardPly :: (String, Game) -> Game
var drawCardPly = curry(function(color, game) {
  check(arguments, [String, Game]);
  var playerIndex = color === 'white' ? 0 : 1;
  var randomIndex = Math.floor(Math.random() * game.decks[playerIndex].length);
  if (not(equals(color, game.turn))) {
    return message('It\'s not your turn!', game);
  } else {
    var newGame = drawCard(color, game);
    if (!newGame.message) {
      return endTurn(Types.DrawPly.of(), newGame);
    } else { return newGame }
  }
});

//  movePly :: (Piece, Position, Game) -> Game
var movePly = curry(function(piece, position, game) {
  check(arguments, [Piece, Position, Game]);
  if (equals(piece.position, position) ||
      // movePiece() already makes this check, any way we can prevent
      // calling it again?
      not(contains(position, getMoves(game.board, piece)))) {
    return game;
  } else if (not(equals(piece.color, game.turn))) {
    return message('It\'s not your turn!', game);
  } else {
    var newGame = movePiece(piece.position, position, game);
    if (newGame) {
      return endTurn(
          Types.MovePly.of({piece, position}),
          newGame);
    } else {
      return game;
    }
  }
});

// (Number)
var useCardPly = curry(function(color, card, params, game) {
  var playerIndex = game.turn === 'white' ? 0 : 1;
  var {positions, pieces, cards} = params;
  if (not(equals(color, game.turn))) {
    return message('It\'s not your turn!', game);
  } else {
    // TODO: rewrite this, check valid squares
    // Create a card lookup with:
    // points needed,
    // params needed
    // action (draft, etc.)
    // Write tests
    var name = game.hands[playerIndex][card];
    if (Cards[name].points <= game.resources[playerIndex]) {
      var newGame = Game.of(evolve({
        hands: adjust(remove(card, 1), playerIndex),
        resources: adjust(subtract(__, Cards[name].points), playerIndex)
      }, game));
      if (pieceCallbacks[name] && pieceCallbacks[name].use != null) {
        newGame = pieceCallbacks[name].use(newGame)
      } else {
        var piece = Piece.of({
          color: color,
          name: game.hands[playerIndex][card],
          position: positions[0],
        });
        newGame = Game.of(evolve({
          board: addPieceToBoard(piece),
        }, newGame));
      }
      if (newGame) {
        return endTurn(Types.UseCardPly.of({card, params}), newGame);
      }
    } else {
      return message('Not enough resources!', game);
    }
  }
});

var abilityPly = curry(function(piece, game) {
  if (not(equals(piece.color, game.turn))) {
    return message('It\'s not your turn!', game);
  } else if (piece.name && pieceCallbacks[piece.name] && pieceCallbacks[piece.name].ability) {
    var newGame = pieceCallbacks[piece.name].ability(piece, game);
    return endTurn(
        Types.AbilityPly.of({piece}),
        newGame);
  } else {
    return game;
  }
});
//  makePly :: (String, Game, Object) -> Maybe Game
var makePly = curry(function(plyType, game, opts) {
  // TODO: check player's turn
  var newGame = game
    , startingPosition = opts.startingPosition
    , targetPosition = opts.targetPosition;

  switch (plyType) {
    case 'move':
      check([startingPosition, targetPosition], [Position, Position]);
      var piece = getAnyPieceAtPosition(game.board, startingPosition);
      if (equals(startingPosition, targetPosition) ||
          not(equals(piece.color, game.turn)) ||
          // movePiece returns null if it's not a valid targetPosition
          not(movePiece(startingPosition, targetPosition, game))) {
        // TODO: Add message.
        newGame = game;
      } else {
        //newGame = movePiece(startingPosition, targetPosition, game);
        newGame = Game.of(evolve({
          turn: function(turn) { return turn === 'white' ? 'black' : 'white'; },
          plys: append([startingPosition, targetPosition])
        }, movePiece(startingPosition, targetPosition, game)));
      }
      break;
    case 'ability':
      var piece = getAnyPieceAtPosition(game.board, startingPosition);
      if (piece.name && pieceCallbacks[piece.name] && pieceCallbacks[piece.name].ability) {
        newGame = Game.of(evolve({
          turn: function(turn) { return turn === 'white' ? 'black' : 'white'; },
          // TODO: make this more clear.
          plys: append([startingPosition, targetPosition || startingPosition])
        }, pieceCallbacks[piece.name].ability(piece, game)));
      }
      break;
    case 'draw':
      // opts: {
      //   color: enum('white', 'black')
      //
      var playerIndex = game.turn === 'white' ? 0 : 1;
      var randomIndex = Math.floor(Math.random() * game.decks[playerIndex].length);
      newGame = Game.of(evolve({
        turn: function(turn) { return turn === 'white' ? 'black' : 'white'; },
        //FIXME: this is broken!!
        plys: append('draw')
      }, drawCard(game.turn, newGame)));

      break;
    case 'draft':
      var color = game.turn === 'white' ? 0 : 1;
      var pieceToAdd = Piece.of({
        name: game.hands[color][opts.card],
        color: game.turn,
        position: Position.of(opts.targetPosition)
      });
      newGame = draftPiece(pieceToAdd, game);
      if (newGame) {
        newGame = Game.of(evolve({
          hands: adjust(remove(opts.card, 1), color),
          turn: function(turn) { return turn === 'white' ? 'black' : 'white'; },
          //FIXME: this is broken!!
          plys: append([targetPosition, targetPosition])
        }, newGame));
      } else {
        return game; // TODO: return null if unsuccessful?
      }
      break;
  }

  return compose(
    // Recursively apply them to the newGame.
    reduce(function(game, piece) {
      return path([piece.name, 'afterEveryPly'], pieceCallbacks)(game, piece);
    }, newGame),
    // Filter only those of current turn.
    filter(propEq('color', game.turn)),
    // Get all pieces with 'afterEveryPly' callback.
    filter(
      compose(
        path(__, pieceCallbacks),
        prepend(__, ['afterEveryPly']),
        prop('name')
      )
    )
  )(newGame.board.pieces);
});

//  movePiece :: (Position, Position, Game) -> Maybe Game
var movePiece = curry(function(startingPosition, targetPosition, game) {
  check(arguments, [Position, Position, Game]);

  var board = game.board
  var piece = getAnyPieceAtPosition(board, startingPosition);
  var capturedPiece = getAnyPieceAtPosition(board, targetPosition);
  var newPosition = always(targetPosition);
  if (capturedPiece && contains('ranged', piece.types)) {
    newPosition = always(startingPosition);
  }

  //TODO implement teleporter
  var onCapture = capturedPiece &&
                  path([piece.name, 'onCapture'], pieceCallbacks) ||
                  curry(function(oldPiece, piece, capturedPiece, game) { return game; });
  // TODO: is equality check appropriate?
  var onCaptured = capturedPiece && capturedPiece.color !== piece.color &&
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
    var newGame = Game.of(evolve({
      board: always(newBoard)
    }, game));
    return Game.of(evolve({
      board: onCaptured(capturedPiece)
    }, onCapture(piece, newPiece, capturedPiece, newGame)));
    //return compose(
      //onCaptured(capturedPiece),
      //onCapture(piece, newPiece, capturedPiece)
    //)(newBoard);
  } else {
    return null;
  }
});

//  isGameOver :: (Board, String) -> Boolean
var isGameOver = curry(function(board, color) {
  check(arguments, [Board, String]);
  //TODO: check position.
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
  check(arguments, [Piece, Board]);
  return Board.of(evolve({
    pieces: addPiece(__, piece)
  }, board));
});

// draftPiece :: (Piece, Game) -> Maybe Game
var draftPiece = curry(function(piece, game) {
  check(arguments, [Piece, Game]);
  var index = piece.color === 'white' ? 0 : 1;

  if (piece.points <= game.resources[index]) {
    return Game.of(evolve({
      board: addPieceToBoard(piece),
      hands: adjust(remove(opts.card, 1), color),
      //board: compose(
               //Board.of,
               //evolve({
                 //pieces: adjust(
                   //compose(
                     //Piece.of,
                     //evolve({
                       //position: always(position)
                     //})
                   //), indexOf(piece, game.board.pieces)
                 //)
               //})
             //),
      resources: adjust(subtract(__, piece.points), index)
    }, game));
  } else {
    // TODO return message.
    return null;
  }
});

// draftPiece :: (String, Game) -> Game
var drawCard = curry(function(color, game) {
  var playerIndex = color === 'white' ? 0 : 1;
  if (game.decks[playerIndex].length < 1) {
    return message('Your deck is empty!', game);
  } else {
    return Game.of(evolve({
      decks: adjust(remove(0, 1), playerIndex),
      hands: adjust(prepend(game.decks[playerIndex][0]), playerIndex)
    }, game));
  }
});

module.exports = {
  movePiece,
  getMoves,
  getCaptures,
  getDefends,
  addPiece,
  getPieceAtPosition,
  makePly,
  isGameOver,
  draftPiece,
  drawCard,
  drawCardPly,
  useCardPly,
  movePly,
  abilityPly,
  getDraftSquares,
  shuffle,
};

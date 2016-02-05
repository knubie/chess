var R        = require('ramda');
var Game     = require('../src/js/engine/Types').Game;
var Board    = require('../src/js/engine/Types').Board;
var Piece    = require('../src/js/engine/Types').Piece;
var Position = require('../src/js/engine/Types').Position;
var Chess    = require('../src/js/engine/Main.js')
for (k in R) { global[k] = R[k]; }

var board = new Board({
  size: 8,
  pieces: [
    new Piece({
      name: 'rook',
      color: 'white',
      position: new Position({x: 4, y: 4})
    })
  ],
});

var game = new Game({
  turn: 'white',
  board: board
});

// :: ([position], [position], Number) -> Boolean
var compare = function(arr1, arr2, i) {
  var i = i || 0;
  var position = arr1[i];
  if (arr1.length === 0 && arr2.length === 0) { return true; }
  if ( any(equals(position), arr2) ) { 
    if (i === arr1.length - 1 && arr2.length === 1) {
      return true;
    } else {
      return compare(arr1, remove(indexOf(position, arr2), 1, arr2), i + 1);
    }
  } else {
    return false
  }
}

describe('Game', function() {
  it('Should be able to create a new game', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          })
        ]
      })
    });
  });
  it('Adding a piece in a position that\'s already occupied should replace that piece', function() {
    var pieces = [
      Piece.of({
        name: 'rook',
        color: 'white',
        position: new Position({x: 4, y: 4})
      }),
      Piece.of({
        name: 'rook',
        color: 'white',
        position: new Position({x: 3, y: 4})
      }),
      Piece.of({
        name: 'rook',
        color: 'white',
        position: new Position({x: 4, y: 5})
      }),
    ]
    var actualPieces = Chess.addPiece(
      pieces,
      Piece.of({
        name: 'bishop',
        color: 'white',
        position: new Position({x: 3, y: 4})
      })
    )
    var expectedPieces = [
      Piece.of({
        name: 'rook',
        color: 'white',
        position: new Position({x: 4, y: 4})
      }),
      Piece.of({
        name: 'bishop',
        color: 'white',
        position: new Position({x: 3, y: 4})
      }),
      Piece.of({
        name: 'rook',
        color: 'white',
        position: new Position({x: 4, y: 5})
      }),
    ]
  });
  it('Drawing a card from the deck into your hand should remove that card from the deck and add it to your hand', function() {
    var game = new Game({
      turn: 'white',
      board: board,
      decks: [['pawn', 'bishop', 'pawn'], []]
    });
    var actualGame = Chess.makePly('draw', game, {});
    expect(actualGame.decks[0].length).toBe(2);
    expect(actualGame.hands[0].length).toBe(1);
    if (contains('bishop', actualGame.hands[0])) {
      expect(contains('bishop', actualGame.decks[0])).toBe(false);
    }
  });
  it('Drafting a piece should reduce that users resources by the point value of the piece', function() {
    var actualGame = Chess.draftPiece(Piece.of({
                       name: 'rook',
                       color: 'white',
                       position: new Position({x: 4, y: 2})
                     }), game);

    expect(actualGame.resources[0]).toBe(5);
  });
  it('Drafting a piece from the users hand should remove that card from their hand', function() {
    var game = new Game({
      turn: 'white',
      hands: [ ['pawn', 'bishop', 'pawn'], [] ],
      board: board
    });
    var actualGame = Chess.makePly('draft', game, {
      startingPosition: null,
      targetPosition: new Position({x: 4, y: 2}),
      card: 0
    });
    expect(equals(actualGame.hands[0], ['bishop', 'pawn'])).toBe(true);
  });
  it('Drafting a piece should add that piece to the Board\'s pieces array granted the user has enough resources to add the piece', function() {
    var actualGame = Chess.draftPiece(Piece.of({
                       name: 'rook',
                       color: 'white',
                       position: new Position({x: 4, y: 2})
                     }), game);
    
    expect(actualGame.board.pieces.length).toBe(2);
  });
  it('Drafting a piece with a higher point value than the users resources should return null', function() {
    var actualGame = Chess.draftPiece(Piece.of({
                       name: 'rook',
                       color: 'white',
                       points: 100,
                       position: new Position({x: 4, y: 2})
                     }), game);
    
    expect(actualGame).toBe(null);
  });
  it('Should change turns when a user makes a ply', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 5})
                                });
    expect(equals(newGame.turn, 'black')).toBe(true);
  });
  it('The afterEveryPly callbacks should fire after every ply', function() {
    var game = Game.of({
      turn: 'white',
      resources: [8, 8],
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          }),
          Piece.of({
            name: 'mine',
            color: 'white',
            position: Position.of({x:4, y:3})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 5})
                                });
    expect(newGame.resources[0]).toBe(9);
  });
  it('Should not change turns when a user moves a piece to its original position', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 4})
                                });
    expect(equals(newGame.turn, 'white')).toBe(true);
  });
  it('Should only move a piece if it\'s that piece\'s turn', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'black',
            position: Position.of({x: 4, y: 4})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 5})
                                });
    expect(equals(game, newGame)).toBe(true);
  });
  it('Should append a ply after a succesful turn', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 5})
                                });
    expect(equals(newGame.plys[0],
                  [Position.of({x: 4, y: 4}),
                   Position.of({x: 4, y: 5})]))
      .toBe(true);
  });
  it('Should not be game over if there are royals left', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          }),
          Piece.of({
            name: 'king',
            color: 'white',
            position: Position.of({x: 2, y: 3})
          }),
          Piece.of({
            name: 'king',
            color: 'black',
            position: Position.of({x: 4, y: 1})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 2})
                                });
    expect(Chess.isGameOver(newGame.board, 'black')).toBe(false);
  });
  it('Should be game over if there are no royals left', function() {
    var game = Game.of({
      turn: 'white',
      board: Board.of({
        size: 8,
        pieces: [
          Piece.of({
            name: 'rook',
            color: 'white',
            position: Position.of({x: 4, y: 4})
          }),
          Piece.of({
            name: 'king',
            color: 'white',
            position: Position.of({x: 2, y: 3})
          }),
          Piece.of({
            name: 'king',
            color: 'black',
            position: Position.of({x: 4, y: 1})
          })
        ]
      })
    }); // game
    var newGame = Chess.makePly('move', game, {
                                  startingPosition: Position.of({x: 4, y: 4}),
                                  targetPosition: Position.of({x: 4, y: 1})
                                });
    expect(Chess.isGameOver(newGame.board, 'black')).toBe(true);
  });
});

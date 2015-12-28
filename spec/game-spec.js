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
    var newGame = Chess.makePly(Position.of({x: 4, y: 4}),
                                Position.of({x: 4, y: 5}),
                                game);
    expect(equals(newGame.turn, 'black')).toBe(true);
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
    var newGame = Chess.makePly(Position.of({x: 4, y: 4}),
                                Position.of({x: 4, y: 4}),
                                game);
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
    var newGame = Chess.makePly(Position.of({x: 4, y: 4}),
                                Position.of({x: 4, y: 5}),
                                game);
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
    var newGame = Chess.makePly(Position.of({x: 4, y: 4}),
                                Position.of({x: 4, y: 5}),
                                game);
    expect(equals(newGame.plys[0],
                  [Position.of({x: 4, y: 4}),
                   Position.of({x: 4, y: 5})]))
      .toBe(true);
  });
});

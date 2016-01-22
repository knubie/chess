var R        = require('ramda');
var Board    = require('../src/js/engine/Types').Board;
var Game    = require('../src/js/engine/Types').Game;
var Piece    = require('../src/js/engine/Types').Piece;
var Position = require('../src/js/engine/Types').Position;
var Chess    = require('../src/js/engine/Main.js')
for (k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}

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

describe('Pieces', function() {
  it('Teleporter should swap pieces with friendly pieces', function() {
    var board = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'bomber',
          color: 'white',
          position: new Position({x: 4, y: 4})
        }),
        new Piece({
          name: 'teleporter',
          color: 'white',
          position: new Position({x: 3, y: 3})
        })
      ],
    });
    var game = new Game({
      turn: 'white',
      board: board
    });
    var expectedBoard = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'teleporter',
          color: 'white',
          position: new Position({x: 4, y: 4}),
          moves: 1
        }),
        new Piece({
          name: 'bomber',
          color: 'white',
          position: new Position({x: 3, y: 3})
        })
      ],
    });
    var actualBoard = Chess.movePiece(
      Position.of({x: 3, y: 3}), Position.of({x: 4, y: 4}),
      board);
    expect(equals(expectedBoard, actualBoard)).toBe(true);
  });
  it('Bomber should remove any piece at it\s position when captured.', function() {
    var board = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'bomber',
          color: 'white',
          position: new Position({x: 3, y: 1})
        }),
        new Piece({
          name: 'knight',
          color: 'black',
          position: new Position({x: 2, y: 3})
        }),
      ],
    });
    var actualBoard = Chess.movePiece(
        Position.of({x: 2, y: 3}), Position.of({x: 3, y: 1}),
        board);
    var expectedBoard = new Board({
      size: 8,
      pieces: [ ],
    });
    expect(equals(expectedBoard, actualBoard)).toBe(true);
  });
  it('Bomber should not blow up pieces when moving to an empty square', function() {
    var board = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 0})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 3, y: 0})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 0})
        }),


        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 1})
        }),
        new Piece({
          name: 'bomber',
          color: 'white',
          position: new Position({x: 3, y: 1})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 1})
        }),


        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 2})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 2})
        }),



        new Piece({
          name: 'knight',
          color: 'black',
          position: new Position({x: 2, y: 3})
        }),
      ],
    });
    var game = new Game({
      turn: 'white',
      board: board
    });
    var actualGame = Chess.makePly('move', game, {
      startingPosition: Position.of({x: 3, y: 1}),
      targetPosition: Position.of({x: 3, y: 2})
    });
    var expectedBoard = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 0})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 3, y: 0})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 0})
        }),


        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 1})
        }),
        new Piece({
          name: 'bomber',
          color: 'white',
          position: new Position({x: 3, y: 2}),
          moves: 1
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 1})
        }),


        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 2})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 2})
        }),



        new Piece({
          name: 'knight',
          color: 'black',
          position: new Position({x: 2, y: 3})
        }),
      ],
    });
    expect(equals(expectedBoard, actualGame.board)).toBe(true);
  });
  it('Bomber ability should blow up surrounding pieces', function() {
    var board = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 0})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 3, y: 0})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 0})
        }),


        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 1})
        }),
        new Piece({
          name: 'bomber',
          color: 'white',
          position: new Position({x: 3, y: 1})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 1})
        }),


        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 2, y: 2})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 3, y: 2})
        }),
        new Piece({
          name: 'pawn',
          color: 'white',
          position: new Position({x: 4, y: 2})
        }),



        new Piece({
          name: 'knight',
          color: 'black',
          position: new Position({x: 2, y: 3})
        }),
      ],
    });
    var game = new Game({
      turn: 'white',
      board: board
    });
    var actualGame = Chess.makePly('ability', game, {
      startingPosition: Position.of({x: 3, y: 1})
    });
    var expectedBoard = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'knight',
          color: 'black',
          position: new Position({x: 2, y: 3})
        })
      ],
    });
    expect(equals(expectedBoard, actualGame.board)).toBe(true);
  });
  it('A wall cannot be captured', function() {
    var board = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'wazir',
          color: 'white',
          position: new Position({x: 2, y: 0})
        }),
        new Piece({
          name: 'wall',
          color: 'black',
          position: new Position({x: 2, y: 1})
        }),
      ],
    });
    var actualMoves = Chess.getMoves(board, board.pieces[0]);
    var expectedMoves = [
      {x: 1, y: 0 },
      {x: 3, y: 0 },
    ];
    expect(compare(expectedMoves, actualMoves)).toBe(true);
  });
  it('Bloodlust\'s movement should increase after every capture', function() {
    var board = new Board({
      size: 8,
      pieces: [
        Piece.of({
          name: 'rook',
          color: 'white',
          position: new Position({x: 4, y: 4})
        }),
        Piece.of({
          name: 'bloodlust',
          color: 'black',
          position: Position.of({x: 3, y: 4})
        })
      ],
    });
    var actualBoard = Chess.movePiece(board.pieces[1].position, board.pieces[0].position, board);
    expect(actualBoard.pieces[0].parlett[0].distance).toBe('2');
  });
});

var R        = require('ramda');
var Board    = require('../src/js/types/Board');
var Piece    = require('../src/js/types/Piece');
var Position = require('../src/js/types/Position');
var Chess    = require('../src/js/chess.js')

describe('Board', function() {
  it('movePiece should return a new board with the updated pieces', function() {
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

    var expectedBoard = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'rook',
          color: 'white',
          position: new Position({x: 4, y: 0})
        })
      ],
    });

    var actualBoard = Chess.movePiece(board, new Position({x: 4, y: 4}), new Position({x: 4, y: 0}));

    expect(R.equals(expectedBoard, actualBoard)).toBe(true);
  });

  it('movePiece should return null when the move is invalid', function() {
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

    var expectedBoard = null; 
    var actualBoard = Chess.movePiece(board, new Position({x: 4, y: 4}), new Position({x: 6, y: 6}));

    expect(R.equals(expectedBoard, actualBoard)).toBe(true);
  });
});

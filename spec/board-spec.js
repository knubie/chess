var R     = require('ramda');
var Board = require('../src/js/board');
var Piece = require('../src/js/piece');
var Position = require('../src/js/position');
var pieces = require('../src/js/pieces');
var move = require('../src/js/move');

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

    var actualBoard = Board.movePiece(board, new Position({x: 4, y: 4}), new Position({x: 4, y: 0}));

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
    var endingPosition = new Position({x: 6, y:6});

    var possibleMoves = move.getMoves(board, startingPosition, pieceLookup[piece.name].parlett);

    if (R.any(R.equals(endingPosition), possiblemoves)) {
      var actualBoard = Board.movePiece(board, new Position({x: 4, y: 4}), new Position({x: 6, y: 6}));
    }



    var actualBoard = Board.movePiece(board, new Position({x: 4, y: 4}), new Position({x: 6, y: 6}));

    expect(R.equals(expectedBoard, actualBoard)).toBe(true);
  });
});

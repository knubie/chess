var R     = require('ramda');
var Board = require('../src/js/board');
var Piece = require('../src/js/piece');
var Position = require('../src/js/position');
var pieces = require('../src/js/pieces');
var move = require('../src/js/move');

// 4412

// :: ([position], [position], Number) -> Boolean
var compare = function(arr1, arr2, i) {
  var i = i || 0;
  var position = arr1[i];
  if ( R.any(R.equals(position), arr2) ) { 
    if (i === arr1.length - 1 && arr2.length === 1) {
      return true;
    } else {
      return compare(arr1, R.remove(R.indexOf(position, arr2), 1, arr2), i + 1);
    }
  } else {
    return false
  }
}

describe('Pieces', function() {
  it('should return all possible moves on an empty board', function() {
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

    var p = board.pieces[0];
    var actualMoves = move.getMoves(board, p.position, pieces[p.name].parlett);

    //var actualMoves = piece.possibleMoves(piece);
    var expectedMoves = [
      {x: 4, y: 0},
      {x: 4, y: 1},
      {x: 4, y: 2},
      {x: 4, y: 3},
      {x: 4, y: 5},
      {x: 4, y: 6},
      {x: 4, y: 7},
      {y: 4, x: 0},
      {y: 4, x: 1},
      {y: 4, x: 2},
      {y: 4, x: 3},
      {y: 4, x: 5},
      {y: 4, x: 6},
      {y: 4, x: 7}
    ];

    expect(compare(expectedMoves, actualMoves)).toBe(true);

    p.position = {x: 0, y: 7}
    actualMoves = move.getMoves(board, p.position, pieces[p.name].parlett);
    //actualMoves = piece.possibleMoves(piece);
    expectedMoves = [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2},
      {x: 0, y: 3},
      {x: 0, y: 4},
      {x: 0, y: 5},
      {x: 0, y: 6},
      {y: 7, x: 1},
      {y: 7, x: 2},
      {y: 7, x: 3},
      {y: 7, x: 4},
      {y: 7, x: 5},
      {y: 7, x: 6},
      {y: 7, x: 7}
    ];
    expect(compare(expectedMoves, actualMoves)).toBe(true);
  });

  it('pieces should block other pieces', function() {
    var board = new Board({
      size: 8,
      pieces: [
        new Piece({
          name: 'rook',
          color: 'white',
          position: new Position({x: 4, y: 4})
        }),
        new Piece({
          name: 'rook',
          color: 'black',
          position: new Position({x: 4, y: 6})
        })
      ],
    });

    var p = board.pieces[0];
    var actualMoves = move.getMoves(board, p.position, pieces[p.name].parlett);
    var expectedMoves = [
      {x: 4, y: 0},
      {x: 4, y: 1},
      {x: 4, y: 2},
      {x: 4, y: 3},
      {x: 4, y: 5}, // Blocked here
      {y: 4, x: 0},
      {y: 4, x: 1},
      {y: 4, x: 2},
      {y: 4, x: 3},
      {y: 4, x: 5},
      {y: 4, x: 6},
      {y: 4, x: 7}
    ];

    expect(compare(expectedMoves, actualMoves)).toBe(true);
  });

});

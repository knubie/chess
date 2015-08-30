var R        = require('ramda');
var Board    = require('../src/js/Types').Board;
var Piece    = require('../src/js/Types').Piece;
var Position = require('../src/js/Types').Position;
var Chess    = require('../src/js/chess.js')

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

describe('Movement', function() {
  it('n+ should return all possible moves', function() {
    var p = R.clone(board.pieces[0]);
    var actualMoves = Chess.getMoves(board, p);
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
    actualMoves = Chess.getMoves(board, p);
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

  it('2+ should return all possible moves', function() {
    var p = R.clone(board.pieces[0]);
    p.parlett = [{direction: '+', distance: '2'}]
    var actualMoves = Chess.getMoves(board, p);
    var expectedMoves = [
      {x: 4, y: 2},
      {x: 4, y: 3},
      {x: 4, y: 5},
      {x: 4, y: 6},
      {y: 4, x: 2},
      {y: 4, x: 3},
      {y: 4, x: 5},
      {y: 4, x: 6}
    ];

    expect(compare(expectedMoves, actualMoves)).toBe(true);
  });

  it('2> should return all possible moves', function() {
    var p = R.clone(board.pieces[0]);
    p.parlett = [{direction: '>', distance: '2'}]
    var actualMoves = Chess.getMoves(board, p);
    var expectedMoves = [
      {x: 4, y: 5},
      {x: 4, y: 6}
    ];

    expect(compare(expectedMoves, actualMoves)).toBe(true);
  });

  it('3<= should return all possible moves', function() {
    var p = R.clone(board.pieces[0]);
    p.parlett = [{direction: '<=', distance: '3'}]
    var actualMoves = Chess.getMoves(board, p);
    var expectedMoves = [
      {x: 4, y: 1},
      {x: 4, y: 2},
      {x: 4, y: 3},
      {y: 4, x: 1},
      {y: 4, x: 2},
      {y: 4, x: 3},
      {y: 4, x: 5},
      {y: 4, x: 6},
      {y: 4, x: 7}
    ];

    expect(compare(expectedMoves, actualMoves)).toBe(true);
  });

  it('other pieces on the board should block movement', function() {
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
    var p = R.clone(board.pieces[0]);
    var actualMoves = Chess.getMoves(board, p);
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

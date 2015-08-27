var R     = require('ramda');
var Board = require('../src/js/Board');

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

    var board = Board._new({
      size: 8,
      white: [
        {
          name: 'pawn',
          position: {x: 4, y: 4}
        }
      ],
      black: []
    });

    var actualMoves = Board.pieces(board)[0].possibleMoves();
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

    board.white[0].position = {x: 0, y: 7}
    var actualMoves = Board.pieces(board)[0].possibleMoves();
    var expectedMoves = [
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

    var board = Board._new({
      size: 8,
      white: [
        {
          name: 'pawn',
          position: {x: 4, y: 4}
        }
      ],
      black: [
        {
          name: 'pawn',
          position: {x: 4, y: 6}
        }
      ]
    });

    var actualMoves = Board.pieces(board)[0].possibleMoves()
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

    //console.log(actualMoves);

    expect(compare(expectedMoves, actualMoves)).toBe(true);

  });

});

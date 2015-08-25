var _     = require('lodash');
var R     = require('ramda');
var Board = require('../src/js/Board');

var board = new Board({
  size: 8,
  white: [
    {
      name: 'pawn',
      position: {x: 4, y: 4}
    }
  ],
  black: []
});

describe('Pieces', function() {
  it('should return all possible moves', function() {

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

    var actualMoves = board.pieces()[0].possibleMoves()
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
  });

});

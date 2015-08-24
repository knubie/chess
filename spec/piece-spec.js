var _     = require('lodash');
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
    var arr = board.pieces()[0].possibleMoves()
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
    var allFound = true;
    _.forEach(expectedMoves, function(n) {
      var found = false;
      _.forEach(arr, function(nn, i) {
        if ( n.x === nn.x && n.y === nn.y ) {
          found = true;
          arr.splice(i, 1);
          return false;
        }
      });
      if (!found) { allFound = false; }
    });
    expect(arr.length).toEqual(0);
    expect(allFound).toBe(true);
  });

});

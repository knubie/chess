var R        = require('ramda');
var Game     = require('../src/js/Types').Game;
var Board    = require('../src/js/Types').Board;
var Piece    = require('../src/js/Types').Piece;
var Position = require('../src/js/Types').Position;
var Chess    = require('../src/js/Main.js')
for (k in R) { global[k] = R[k]; }

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
    })
  });
  it('Shouldn\'t be able to make an army that exceeds 45 points', function() {
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
      Piece.of({
        name: 'bishop',
        color: 'white',
        position: new Position({x: 3, y: 4})
      }), pieces
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
});

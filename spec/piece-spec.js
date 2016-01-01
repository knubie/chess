var R        = require('ramda');
var Board    = require('../src/js/engine/Types').Board;
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
  it('Bomber should blow up surrounding pieces', function() {
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
    var actualBoard = Chess.movePiece(
        Position.of({x: 2, y: 3}), Position.of({x: 3, y: 1}),
        board);
    console.log(actualBoard.pieces);
    var expectedBoard = new Board({
      size: 8,
      pieces: [ ],
    });
    expect(equals(expectedBoard, actualBoard)).toBe(true);
  });
});

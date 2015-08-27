var Board = require('./board/Board');
var Piece = require('./pieces/Piece.js');
var pieces = require('./pieces/pieces.js');
var R = require('ramda');

window.board = Board._new({
  size: 8,
  white: [
    {
      name: 'rook',
      position: {x: 4, y: 4}
    }
  ],
  black: [],
  pieces: require('./pieces/pieces.js')
});

// listPossibleMoves(board);
console.log(Board.pieces(board));

console.log(Board);

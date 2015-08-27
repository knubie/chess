var Board = require('./Board');
var R = require('ramda');

window.board = Board._new({
  white: [
    {
      name: 'pawn',
      position: {x: 4, y: 4}
    }
  ],
  black: []
});

// listPossibleMoves(board);
console.log(Board.pieces(board));

console.log(Board);

var Pawn = require('./pieces/Pawn');
var Board = require('./Board');

window.board = new Board({
  white: [
    {
      name: 'pawn',
      position: {x: 1, y: 1}
    }
  ],
  black: [
    {
      name: 'pawn',
      position: {x: 1, y: 1}
    }
  ]
});

//var pawn = new Pawn(board, {x: 1, y:1});

//board.pieces.push(pawn);



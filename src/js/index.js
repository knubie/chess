var Pawn = require('./pieces/Pawn');
var Board = require('./Board');

window.board = new Board({
  white: [
    {
      name: 'pawn',
      position: {x: 4, y: 4}
    }
  ],
  black: []
});


console.log(board.pieces()[0].possibleMoves());

//var pawn = new Pawn(board, {x: 1, y:1});

//board.pieces.push(pawn);



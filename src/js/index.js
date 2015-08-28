var Board = require('./board');
var move = require('../src/js/move');
var pieces = require('../src/js/pieces');

var R = require('ramda');

window.board = new Board({
  size: 8,
  white: [
    {
      name: 'rook',
      position: {x: 4, y: 4}
    }
  ],
  black: [],
});

var piece = board.white[0];
var possibleMoves = move.getMoves(board, piece.position, pieces[piece.name].parlett);

// var p = getSelectedPiece(event);
//var possibleMoves = move.getMoves(board, p.position, pieces[p.name].parlett);
//var IO.renderPossibleMoves(possibleMoves);
//R.prop('position')
//R.prop('parlett', pieces[selectedPiece.name])
//R.compose(renderPossibleMoves, move.getMoves(board, ...



// listPossibleMoves(board);

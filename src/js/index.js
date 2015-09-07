var React = require('react');
var Board = require('./components/Board');
var Types = require('./engine/Types');

var board = Types.Board.of({
  size: 8,
  pieces: [
    Types.Piece.of({
      name: 'rook',
      color: 'white',
      position: Types.Position.of({x: 4, y: 4})
    }),
    Types.Piece.of({
      name: 'bishop',
      color: 'white',
      position: Types.Position.of({x: 3, y: 4})
    }),
    Types.Piece.of({
      name: 'pawn',
      color: 'black',
      position: Types.Position.of({x: 3, y: 7})
    }),
  ],
});

React.render(
  <Board data={board} />,
  document.getElementById('container')
);

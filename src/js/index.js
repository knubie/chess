var React = require('react');
var ReactDOM = require('react-dom');
var Board = require('./components/Board');
var Home = require('./components/Home');
var Types = require('./engine/Types');

var board = Types.Board.of({
  size: 8,
  pieces: [
    Types.Piece.of({
      name: 'rook',
      color: 'white',
      position: Types.Position.of({x: 0, y: 0})
    }),
    Types.Piece.of({
      name: 'knight',
      color: 'white',
      position: Types.Position.of({x: 1, y: 0})
    }),
    Types.Piece.of({
      name: 'bishop',
      color: 'white',
      position: Types.Position.of({x: 2, y: 0})
    }),
    Types.Piece.of({
      name: 'queen',
      color: 'white',
      position: Types.Position.of({x: 3, y: 0})
    }),
    Types.Piece.of({
      name: 'king',
      color: 'white',
      position: Types.Position.of({x: 4, y: 0})
    }),
    Types.Piece.of({
      name: 'bishop',
      color: 'white',
      position: Types.Position.of({x: 5, y: 0})
    }),
    Types.Piece.of({
      name: 'knight',
      color: 'white',
      position: Types.Position.of({x: 6, y: 0})
    }),
    Types.Piece.of({
      name: 'rook',
      color: 'white',
      position: Types.Position.of({x: 7, y: 0})
    }),
    Types.Piece.of({
      name: 'pawn',
      color: 'black',
      position: Types.Position.of({x: 3, y: 7})
    }),
    Types.Piece.of({
      name: 'pawn',
      color: 'black',
      position: Types.Position.of({x: 2, y: 7})
    }),
    Types.Piece.of({
      name: 'pawn',
      color: 'black',
      position: Types.Position.of({x: 1, y: 7})
    }),
    Types.Piece.of({
      name: 'pawn',
      color: 'black',
      position: Types.Position.of({x: 0, y: 7})
    }),
    Types.Piece.of({
      name: 'nightrider',
      color: 'black',
      position: Types.Position.of({x: 0, y: 6})
    }),
    Types.Piece.of({
      name: 'cannon',
      color: 'black',
      position: Types.Position.of({x: 3, y: 6})
    }),
    Types.Piece.of({
      name: 'bloodlust',
      color: 'black',
      position: Types.Position.of({x: 4, y: 6})
    }),
  ],
});

ReactDOM.render(
  <Home />,
  document.getElementById('container')
);

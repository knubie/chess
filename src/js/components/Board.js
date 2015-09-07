var R = require('ramda');
var React = require('react');
var Piece = require('./Piece');

var Board = React.createClass({
  render: function() {
    var pieceNodes = R.map(function(piece) {
      return (
        <Piece name={piece.name} x={piece.position.x} y={piece.position.y}></Piece>
      )
    }, this.props.data.pieces);
    return (
      <div className="chess-board">
        This is a chessboard.
        {pieceNodes}
      </div>
    );
  }
});

module.exports = Board;

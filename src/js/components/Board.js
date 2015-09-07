var R = require('ramda');
var React = require('react');
var Piece = require('./Piece');

var Board = React.createClass({
  render: function() {
    var className = "chess-board size-" + this.props.data.size;
    var _this = this;
    var pieceNodes = R.map(function(piece) {
      return (
        <Piece name={piece.name} color={piece.color} x={piece.position.x} y={piece.position.y}></Piece>
      );
    }, this.props.data.pieces);

    var squaresRow = R.map(function() {
      return (
        <div className="square"></div>
      );
    }, R.range(1, _this.props.data.size + 1));
    var squares = R.flatten(R.map(function() {
      return (
        <div className="row">{squaresRow}</div>
      );
    }, R.range(1, this.props.data.size + 1)));
    return (
      <div className={className}>
        {squares}
        {pieceNodes}
      </div>
    );
  }
});

module.exports = Board;

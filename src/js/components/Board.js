var R = require('ramda');
var React = require('react');
var Piece = require('./Piece');
var Chess = require('../engine/Main');
var Types = require('../engine/Types');

var Board = React.createClass({
  getInitialState: function() {
    return {
      possibleMoves: [ ]
    }
  },
  clickPiece: function(piece) {
    var board = this.props.data;
    this.setState({
      possibleMoves: Chess.getMoves(board, piece)
    });
  },
  render: function() {
    var _this = this;
    var className = "chess-board size-" + this.props.data.size;
    var pieceNodes = R.map(function(piece) {
      return (
        <Piece data={piece} onClick={_this.clickPiece}></Piece>
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

    var possibleMovesNodes = R.map(function(pos) {
      var className = "move-square x-" + pos.x + " y-" + pos.y;
      return (
        <div className={className}></div>
      )
    }, this.state.possibleMoves);

    return (
      <div className={className}>
        {squares}
        {possibleMovesNodes}
        {pieceNodes}
      </div>
    );
  }
});

module.exports = Board;

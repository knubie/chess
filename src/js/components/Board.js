var R = require('ramda');
var $ = require('jquery');
var React = require('react');
var Piece = require('./Piece');
var Chess = require('../engine/Main');
var Types = require('../engine/Types');

var Board = React.createClass({
  getInitialState: function() {
    return {
      board: this.props.board,
      possibleMoves: [ ],
      selectedPiece: null
    }
  },
  clickPiece: function(piece) {
    this.setState({
      possibleMoves: Chess.getMoves(this.state.board, piece),
      selectedPiece: piece
    });
  },
  clickSquare: function(e) {
    //var position = Types.Position.of({
      //x: $(e.target).index(),
      //y: this.state.board.size - 1 - $(e.target).parent().index()
    //});
    this.setState({
      possibleMoves: [],
    });
    //console.log('Clicked on a square!');
    //console.log(e.target);
    //console.log("x: " + $(e.target).index());
    //console.log("y: " + (this.state.board.size - 1 - $(e.target).parent().index()));
  },
  clickPossibleMove: function(e) {
    console.log('click possible move');
    var position = Types.Position.of({
      x: parseInt($(e.target).attr('class').match(/x-(\d) y-(\d)/)[1]),
      y: parseInt($(e.target).attr('class').match(/x-(\d) y-(\d)/)[2])
    });
    this.setState({
      possibleMoves: [],
      board: Chess.movePiece(this.state.board, this.state.selectedPiece.position, position)
    });
  },
  render: function() {
    var _this = this;
    var className = "chess-board size-" + this.state.board.size;
    var pieceNodes = R.map(function(piece) {
      return (
        <Piece piece={piece} onClick={_this.clickPiece}></Piece>
      );
    }, this.state.board.pieces);

    var squaresRow = R.map(function() {
      return (
        <div className="square" onClick={_this.clickSquare}></div>
      );
    }, R.range(1, _this.state.board.size + 1));

    var squares = R.flatten(R.map(function() {
      return (
        <div className="row">{squaresRow}</div>
      );
    }, R.range(1, this.state.board.size + 1)));

    var possibleMovesNodes = R.map(function(pos) {
      var className = "move-square x-" + pos.x + " y-" + pos.y;
      return (
        <div className={className} onClick={_this.clickPossibleMove}></div>
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

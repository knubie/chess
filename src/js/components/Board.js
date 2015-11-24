var R = require('ramda');
var $ = require('jquery');
var React = require('react');
var Piece = require('./Piece');
var Square = require('./Square');
var Chess = require('../engine/Main');
var Types = require('../engine/Types');

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var Board = React.createClass({
  getInitialState: function() {
    return {
      board: this.props.board,
      possibleMoves: [ ],
      selectedPiece: null
    }
  },
  clickPiece: function(piece) {
    console.log('click piece');
    this.setState({
      possibleMoves: Chess.getMoves(this.state.board, piece),
      selectedPiece: piece
    });
  },
  clickSquare: function(x, y) {
    console.log('click square');
    var position = Types.Position.of({ x: x, y: y });
    if (this.state.selectedPiece) {
      this.setState({
        possibleMoves: [],
        board: Chess.movePiece(this.state.board,
                               this.state.selectedPiece.position,
                               position) || this.state.board,
        selectedPiece: null
      });
    }
  },
  canDrop: function(x, y) {
  },
  clickPossibleMove: function(e) {
    var position = Types.Position.of({
      x: parseInt($(e.target).attr('class').match(/x-(\d) y-(\d)/)[1]),
      y: parseInt($(e.target).attr('class').match(/x-(\d) y-(\d)/)[2])
    });
    this.setState({
      possibleMoves: [],
      board: Chess.movePiece(this.state.board,
                             this.state.selectedPiece.position,
                             position)
    });
  },
  render: function() {
    var _this = this;
    var className = "chess-board " +
                    "size-" + this.state.board.size;

    var squares = R.flatten(R.map(function(y) {
      var y = _this.state.board.size - y - 1;
      return (
        <div className="row">
          {R.map(function(x) {
            var returnPiece = function(piece) {
              return piece == null ?
                              null :
                              <Piece piece={piece}
                                     onDrag={_this.clickPiece}
                                     onClick={_this.clickPiece}>
                              </Piece>;
            }
            var returnPossibleMoves = function(pos) {
              return pos == null ?
                            null :
                            <div className='move-square'></div>
            }
            return (
              <Square onClick={_this.clickSquare.bind(_this, x, y)}
                      onDrop={_this.clickSquare.bind(_this, x, y)}
                      canDrop={_this.canDrop.bind(_this, x, y)}
                      x={x} y={y}>
                {returnPiece(R.find(function(piece) {
                  return (x === piece.position.x && y === piece.position.y);
                }, _this.state.board.pieces))}
                {returnPossibleMoves(R.find(function(pos) {
                  return (x === pos.x && y === pos.y);
                }, _this.state.possibleMoves))}
              </Square>
            );
          }, R.range(0, _this.state.board.size))}
        </div>
      );
    }, R.range(0, this.state.board.size)));

    var possibleMovesNodes = R.map(function(pos) {
      var className = "move-square x-" + pos.x + " y-" + pos.y;
      return (
        <div className={className} onClick={_this.clickPossibleMove}></div>
      )
    }, this.state.possibleMoves);

    return (
      <div className={className}>
        {squares}
      </div>
    );
  }
});

module.exports = DragDropContext(HTML5Backend)(Board);
//module.exports = Board;

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
      game: this.props.game,
      possibleMoves: [ ],
      selectedPiece: null
    }
  },
  clickPiece: function(piece) {
    this.setState({
      possibleMoves: Chess.getMoves(this.state.game.board, piece),
      selectedPiece: piece
    });
  },
  clickSquare: function(x, y, piece) {
    var position = Types.Position.of({ x: x, y: y });
    var movedPiece = this.state.selectedPiece || piece;
    // Account for moving to other friendly piece.
    if (this.state.selectedPiece) {
      this.setState({
        possibleMoves: [],
        game: Chess.makePly(this.state.game,
                            movedPiece.position,
                            position),
        selectedPiece: null
      });
    }
  },
  canDrop: function(x, y) {
  },
  render: function() {
    var _this = this;
    var className = "chess-board " +
                    "size-" + this.state.game.board.size;

    var squares = R.flatten(R.map(function(y) {
      var y = _this.state.game.board.size - y - 1;
      return R.map(function(x) {
        var returnPiece = function(piece) {
          return piece == null ?
                          null :
                          <Piece piece={piece}
                                 onDrag={_this.clickPiece}
                                 onClick={_this.clickPiece}>
                          </Piece>;
        }
        var returnPossibleMove = function(pos) {
          return pos == null ?
                        null :
                        <div className='move-square'></div>
        }
        var color = (x + y) % 2 === 1 ? 'black' : 'white'
        return (
          <Square onClick={_this.clickSquare.bind(_this, x, y)}
                  onDrop={_this.clickSquare.bind(_this, x, y)}
                  canDrop={_this.canDrop.bind(_this, x, y)}
                  color={color}
                  x={x} y={y}>
            {returnPiece(R.find(R.compose(
              R.whereEq({x:x,y:y}),
              R.prop('position')
            ), _this.state.game.board.pieces))}
            {returnPossibleMove(R.find(R.whereEq({x:x,y:y})
            , _this.state.possibleMoves))}
          </Square>
        );
      }, R.range(0, _this.state.game.board.size));
    }, R.range(0, this.state.game.board.size)));

    var possibleMovesNodes = R.map(function(pos) {
      var className = "move-square x-" + pos.x + " y-" + pos.y;
      return (
        <div className={className} onClick={_this.clickPossibleMove}></div>
      )
    }, this.state.possibleMoves);

    return (
      <div>
        <span>turn: </span>
        <span className='turn'>{this.state.game.turn}</span>
        <div className={className}>
          {squares}
        </div>
      </div>
    );
  }
});

module.exports = DragDropContext(HTML5Backend)(Board);
//module.exports = Board;

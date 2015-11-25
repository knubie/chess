var R = require('ramda');
var $ = require('jquery');
var React = require('react');
var Piece = require('./Piece');
var Square = require('./Square');
var Chess = require('../engine/Main');
var Pieces = require('../engine/Pieces');
var Types = require('../engine/Types');

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var boardSize = 8;

var Builder = React.createClass({
  getInitialState: function() {
    return {
      pieces: [ ],
      allPieces: R.map(function(name) {
        return Types.Piece.of({
          name: name,
          color: 'white',
          position: Types.Position.of({x: -1, y: -1})
        });
      }, R.keys(Pieces))
    }
  },
  onDrop: function(x, y, piece) {
    console.log('Dropped ' + piece.name + ' at x:', + x + ', y:' + y);
    console.log(this.state.pieces);
    this.setState({
      pieces: Chess.addPiece(
        // If moving a piece already on the board, remove it.
        reject(propEq('position', piece.position), this.state.pieces),
        Types.Piece.of({
          name: piece.name,
          color: piece.color,
          position: Types.Position.of({x: x, y: y})
        })
      )
    });
  },
  render: function() {
    var _this = this;
    var returnPiece = function(piece) {
      return piece == null ?
                      null :
                      <Piece piece={piece}></Piece>;
    }
    return (
      <div>
        <div className='piece-selection'>
          {R.map(function(piece) {
            return (<Piece piece={piece}></Piece>)
          }, this.state.allPieces)}
        </div>
        <div className='chess-board size-8 builder'>
          {R.flatten(R.map(function(y) {
            return R.map(function(x) {
              var color = (x + y) % 2 === 1 ? 'black' : 'white'
              return (
                <Square color={color}
                        onDrop={_this.onDrop}
                        x={x} y={y}>
                  {returnPiece(R.find(function(piece) {
                    return (x === piece.position.x && y === piece.position.y);
                  }, _this.state.pieces))}
                </Square>
              );
            }, R.range(0, boardSize));
          }, R.range(0, 2)))}
        </div>
      </div>
    );
  }
});

module.exports = DragDropContext(HTML5Backend)(Builder);

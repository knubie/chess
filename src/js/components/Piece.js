var React = require('react');
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;

var itemTypes = {
  PIECE: 'piece'
};

var pieceSource = {
  beginDrag: function (props) {
    if (typeof props.onDrag === 'function') {
      props.onDrag(props.piece);
    }
    return {piece: props.piece};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

var Piece = React.createClass({
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  },
  onClick: function() {
    this.props.onClick(this.props.piece);
  },
  render: function() {
    var connectDragSource = this.props.connectDragSource;
    var isDragging = this.props.isDragging;
    var pieceLookup = {
      white: {
        king: '&#9812',
        queen: '&#9813',
        rook: '&#9814',
        bishop: '&#9815',
        knight: '&#9816',
        pawn: '&#9817',
        'nightrider': 'O',
        'cannon': 'I',
        'bloodlust': 'B',
        'bomber': 'b',
        'dabbaba': 'D',
        'alfil': 'A',
        'wazir': 'W',
        'ferz': 'F',
        'archbishop': 'a',
        'empress': 'E',
        'berolina': 'L'
      },
      black: {
        king: '&#9818',
        queen: '&#9819',
        rook: '&#9820',
        bishop: '&#9821',
        knight: '&#9822',
        pawn: '&#9823',
        'nightrider': 'O',
        'cannon': 'I',
        'bloodlust': 'B'
      }
    }
    var className = "piece";
    return connectDragSource(
      <div className={className} onClick={this.onClick} style={{display: 'inline-block', opacity: isDragging ? 0 : 1}}>
        <span
          dangerouslySetInnerHTML={{
            __html: pieceLookup[this.props.piece.color][this.props.piece.name]
          }}
        />
      </div>
    );
  }
});

module.exports = DragSource(itemTypes.PIECE, pieceSource, collect)(Piece);
//module.exports = Piece;

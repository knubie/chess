var React = require('react');

var Piece = React.createClass({
  onClick: function() {
    this.props.onClick(this.props.data);
  },
  render: function() {
    var pieceLookup = {
      white: {
        king: '&#9812',
        queen: '&#9813',
        rook: '&#9814',
        bishop: '&#9815',
        knight: '&#9816',
        pawn: '&#9817'
      },
      black: {
        king: '&#9818',
        queen: '&#9819',
        rook: '&#9820',
        bishop: '&#9821',
        knight: '&#9822',
        pawn: '&#9823'
      }
    }
    var className = "piece x-" + this.props.data.position.x + " y-" + this.props.data.position.y;
    return (
      <div className={className} onClick={this.onClick}>
        <span
          dangerouslySetInnerHTML={{
            __html: pieceLookup[this.props.data.color][this.props.data.name]
          }}
        />
        {this.props.children}
      </div>
    );
  }
});

module.exports = Piece;


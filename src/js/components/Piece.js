var React = require('react');

var Piece = React.createClass({
  render: function() {
    var className = "piece x-" + this.props.x + " y-" + this.props.y;
    return (
      <div className={className}>
        This is a {this.props.name} piece.
        {this.props.children}
      </div>
    );
  }
});

module.exports = Piece;


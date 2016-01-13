var React = require('react');
var DropTarget = require('react-dnd').DropTarget;

var itemTypes = {
  PIECE: 'piece'
};
var squareTarget = {
  drop: function (props, monitor) {
    props.onDrop(props.x, props.y, monitor.getItem().piece);
  }
};
// Implement moveKnight
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  };
}
var Square = React.createClass({
  onClick: function() {
    this.props.onClick();
  },
  render: function() {
    var connectDropTarget = this.props.connectDropTarget;
    var isOver = this.props.isOver;
    var className = 'square ' + this.props.color;
    return connectDropTarget(
      <div className={className} onClick={this.onClick}>
        {this.props.children}
        {isOver && <div className='move-square'></div>}
      </div>
    );
  }
});

module.exports = DropTarget(itemTypes.PIECE, squareTarget, collect)(Square);

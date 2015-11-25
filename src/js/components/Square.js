var React = require('react');
var DropTarget = require('react-dnd').DropTarget;

var itemTypes = {
  PIECE: 'piece'
};
var squareTarget = {
  drop: function (props, monitor) {
    console.log('drop');
    console.log(monitor.getItem());
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
    return connectDropTarget(
      <div className="square" onClick={this.onClick}>
        {this.props.children}
        {isOver && <div className='move-square'></div>}
      </div>
    );
  }
});

module.exports = DropTarget(itemTypes.PIECE, squareTarget, collect)(Square);

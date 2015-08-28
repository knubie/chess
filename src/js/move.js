var R = require('ramda');
var Board = require('./board');

var orthogonal = R.curry(function(direction, board, position, distance) {
  distance = distance === 'n' ? board.size - 1 : parseInt(distance);

  var getPosition = R.curry(function(axis, i) {
    return {
      x: (axis === 'x') ? i : position.x,
      y: (axis === 'y') ? i : position.y
    };
  });

  // Filter out falsey values.
  // The identity returns its parameter,
  // hence if parameter is falsey it will return falsey.
  return R.filter(R.identity, R.flatten(
    R.map(function(axis) {
      var min = Math.max(position[axis] - distance, 0)
      var max = Math.min(position[axis] + distance + 1, board.size)
      return R.map(function(i) {
        var inBetween = i < position[axis]
                      ? R.range(i, position[axis])
                      : R.range(position[axis] + 1, i + 1);

        var blockingPieces = R.any(
          R.compose(
            Board.getPieceAtPosition(board),
            getPosition(axis)
          ), inBetween);

        // TODO: moveType check
        if (blockingPieces) {
          // TODO: check if piece is opposite color, add to captures
          return false; // Gets filtered out.
        } else {
          return getPosition(axis, i);
        }
        // TODO: limit this to distance
      }, R.concat(R.range(min, position[axis]), R.range(position[axis] + 1, max)));
    }, ['x', 'y'])
  ));
});

var directions = {
  '+': orthogonal(null),
  '>': orthogonal('forwards'),
  '<': orthogonal('backwards')
};

module.exports = {
  getMoves: R.curry(function(board, position, parlett) {
    return directions[parlett[0].direction](board, position, parlett[0].distance);
  })
}

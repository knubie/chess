var R = require('ramda');
var Board = require('../board/Board');

var getOrthogonal = function(piece, board, distance) {
  distance = distance === 'n' ? board.size - 1 : parseInt(distance);

  var getPosition = R.curry(function(axis, i) {
    return {
      x: (axis === 'x') ? i : piece.position.x,
      y: (axis === 'y') ? i : piece.position.y
    };
  });

  // Filter out falsey values.
  // The identity returns its parameter,
  // hence if parameter is falsey it will return falsey.
  return R.filter(R.identity, R.flatten(
    R.map(function(axis) {
      var min = Math.max(piece.position[axis] - distance, 0)
      var max = Math.min(piece.position[axis] + distance + 1, board.size)
      return R.map(function(i) {
        var inBetween = i < piece.position[axis]
                      ? R.range(i, piece.position[axis])
                      : R.range(piece.position[axis] + 1, i + 1);

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
      }, R.concat(R.range(min, piece.position[axis]), R.range(piece.position[axis] + 1, max)));
    }, ['x', 'y'])
  ));
};

var directions = {
  '+': getOrthogonal
};

var parseParlett = R.curry(function(parlett, piece, board) {
  var possibilities = [];

  R.forEach(function(rule) {
    if (parlett.condition !== 'c') {
      possibilities = directions[rule.direction](piece, board, rule.distance);

    }
  }, parlett);

  return possibilities;
});

module.exports = parseParlett;

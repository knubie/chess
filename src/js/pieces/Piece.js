module.exports = Piece;

var _ = require('lodash');
var R = require('ramda');

var optionDefaults = {

};

var id = 0;

function Piece(_board, _options) {
  _.extend(this, _.defaultsDeep(_options, optionDefaults));
  this.board = _board;
  this.id = ++id;

  this.parlett = this.parlett || '';
}

// Rook: n+
Piece.prototype.possibleMoves = function() {
  var possibilities = [];

  var _this = this;

  _.forEach(this.parlett.split(','), function(rule) {
    var condition = rule[0];
    if (condition !== 'c') {
      var distance = rule[1];
      var direction = rule[2];

      switch(direction) {
        case '+':
          possibilities = R.uniq(possibilities.concat(_this.getOrthogonal(distance)));
          break;
      }

    }
  });

  return possibilities;
};

Piece.prototype.getOrthogonal = function(distance) {
  var _this = this;

  distance = distance === 'n' ? _this.board.size - 1 : parseInt(distance);

  var getPosition = R.curry(function(axis, i) {
    return {
      x: (axis === 'x') ? i : _this.position.x,
      y: (axis === 'y') ? i : _this.position.y
    };
  });

  var getPieceAtPosition = R.curry(function(board, position) {
    return R.find( R.propEq('position', position), board.pieces());
  });

  // Filter out falsey values.
  // The identity returns its parameter,
  // hence if parameter is falsey it will return falsey.
  return R.filter(R.identity, R.flatten(
    R.map(function(axis) {
      var min = Math.max(_this.position[axis] - distance, 0)
      var max = Math.min(_this.position[axis] + distance, _this.board.size)
      return R.map(function(i) {
        var inBetween = i < _this.position[axis]
                      ? R.range(i, _this.position[axis])
                      : R.range(_this.position[axis] + 1, i + 1);

        var blockingPieces = R.any(
          R.compose(
            getPieceAtPosition(_this.board),
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
      }, R.concat(R.range(min, _this.position[axis]), R.range(_this.position[axis] + 1, max)));
    }, ['x', 'y'])
  ));
}

Piece.prototype.possibleCaptures = function() { };

Piece.prototype.moveTo = function(x, y) {
  if (!(x < 0 || x >= this.board.size.width || y < 0 || y > this.board.size.height)) {

  }
};

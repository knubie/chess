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
          // TODO: remove duplicates
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

  var possibilities = [];

  _.forEach(['x', 'y'], function(axis) {
    _.forEach([1, -1], function(direction) {
      var range = _.range(_this.position[axis] + direction, _this.position[axis] + ((distance + 1) * direction), direction);
      _.forEach(range, function(i) {
        var position = {
          x: (axis === 'x') ? i : _this.position.x,
          y: (axis === 'y') ? i : _this.position.y
        };

        // TODO: moveType check
        if (_this.board.getPieceAtPosition(position) !== undefined) {
          return false;
        } else if (_this.board.legalPosition(position)) {
          possibilities.push(position);
        }
      })
    });
  });

  return possibilities;
}

Piece.prototype.possibleCaptures = function() { };

Piece.prototype.moveTo = function(x, y) {
  if (!(x < 0 || x >= this.board.size.width || y < 0 || y > this.board.size.height)) {

  }
};

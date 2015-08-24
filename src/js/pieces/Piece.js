module.exports = Piece;

var _ = require('lodash');

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

      distance = distance === 'n' ? _this.board.size - 1 : parseInt(distance);

      switch(direction) {
        case '+':
          function iterationCheck(d) {
            return function(i, axis, blocked) {
              if (d > 0) {
                return i < _this.position[axis] + (distance * d) && !blocked;
              } else {
                return i > _this.position[axis] + (distance * d) && !blocked;
              }
            }
          }

          _.forEach(['x', 'y'], function(axis) {
            _.forEach([1, -1], function(d) {
              var localIterationCheck = iterationCheck(d);
              var blocked = false;
              for(var i = _this.position[axis] + d; localIterationCheck(i, axis, blocked) === true; i += d) {
                var position = {
                  x: (axis === 'x') ? i : _this.position.x,
                  y: (axis === 'y') ? i : _this.position.y
                };

                var pieceAtPosition = _this.board.getPieceAtPosition(position);

                // TODO: moveType check
                if (pieceAtPosition !== undefined) {
                  blocked = true;
                } else if (_this.board.legalPosition(position) && !blocked) {
                  possibilities.push(position);
                }
              }
            });
          });
          break;
      }
    }
  });

  return possibilities;
};

Piece.prototype.possibleCaptures = function() { };

Piece.prototype.moveTo = function(x, y) {
  if (!(x < 0 || x >= this.board.size.width || y < 0 || y > this.board.size.height)) {

  }
};

var R = require('ramda');

var Board = {};
Board.validate = function(_self) {
  // Validate the Board data structure.
};

Board.pieces = R.curry(function(_self) {
  return Array.prototype.concat.call([], _self.white, _self.black);
});

Board.getPieceAtPosition = R.curry(function(_self, position) {
  return R.find(R.propEq('position', position), Board.pieces(_self));
});

Board.legalPosition = R.curry(function(_self, position) {
  return position.x >= 0 && position.x < _self.size && position.y >= 0 && position.y < _self.size;
});

module.exports = Board;

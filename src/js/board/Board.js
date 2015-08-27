var R = require('ramda');

var optionDefaults = {
  size: 10
};

var Board = {
  _new: R.curry(function(_options) {
    var _self = {};

    // TODO: Check for null options
    _self = R.merge(_self, R.merge(optionDefaults, _options));

    R.forEach(function(color) {
      _self[color] = R.map(function(piece) {
        return _options.pieces[piece.name]._new(piece, _self);
      }, _self[color]);
    }, ['white', 'black']);

    return _self;
  })
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

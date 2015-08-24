module.exports = Board;

var _ = require('lodash');

var optionDefaults = {
  size: {
    width: 8,
    height: 8
  }
};

function Board(_options) {
  this.options = _.defaultsDeep(_options, optionDefaults);

  this.pieces = [];

  if (this.options.size === undefined) {
    // TODO: Throw error
  }
}

Board.prototype.getPieceAtPosition = function(x, y) {
  return _.filter(this.pieces, function(piece) {
    return piece.position.x === x && piece.position.y === y;
  })[0];
};

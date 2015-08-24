module.exports = Board;

var _ = require('lodash');
var pieces = require('./pieces/pieces');

var optionDefaults = {
  size: {
    width: 8,
    height: 8
  }
};

function Board(_options) {
  var _this = this;

  _.extend(this, _.defaultsDeep(_options, optionDefaults));

  _.forEach(['white', 'black'], function(color) {
    _.map(this[color], function(piece) {
      return new pieces[piece.name].c(_this, piece);
    })
  });


  if (this.options.size === undefined) {
    // TODO: Throw error
  }
}

Board.prototype.pieces = function() {
  return Array.prototype.call(null, this.white, this.black);
}

Board.prototype.getPieceAtPosition = function(x, y) {
  return _.filter(this.pieces(), function(piece) {
    return piece.position.x === x && piece.position.y === y;
  })[0];
};

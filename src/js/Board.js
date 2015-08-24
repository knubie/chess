module.exports = Board;

var _ = require('lodash');
var pieces = require('./pieces/pieces');

var optionDefaults = {
  size: 10
};

function Board(_options) {
  var _this = this;

  _.extend(this, _.defaultsDeep(_options, optionDefaults));

  _.forEach(['white', 'black'], function(color) {
    _this[color] = _.map(_this[color], function(piece) {
      return new pieces[piece.name].klass(_this, piece);
    })
  });


  if (this.size === undefined) {
    // TODO: Throw error
  }
}

Board.prototype.pieces = function() {
  return Array.prototype.concat.call([], this.white, this.black);
}

Board.prototype.getPieceAtPosition = function(position) {
  return _.filter(this.pieces(), function(piece) {
    return piece.position.x === position.x && piece.position.y === position.y;
  })[0];
};

Board.prototype.legalPosition = function(position) {
  return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
};

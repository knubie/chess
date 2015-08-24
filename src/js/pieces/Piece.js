module.exports = Piece;

var _ = require('lodash');

var optionDefaults = {

};

var id = 0;

function Piece(_board, _options) {
  this.options = _.defaultsDeep(_options, optionDefaults);
  this.board = _board;
  this.id = ++id;

  if (this.options.position === undefined) {
    // TODO: Throw error
  }
}

Piece.prototype.possibleMoves = function() { };
Piece.prototype.possibleCaptures = function() { };

Piece.prototype.moveTo = function(x, y) {
  if (!(x < 0 || x >= this.board.size.width || y < 0 || y > this.board.size.height)) {

  }
};

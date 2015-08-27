module.exports = Piece;

var _ = require('lodash');
var R = require('ramda');

var parseParlett = require('../parlett/parseParlett');

var optionDefaults = {

};

var id = 0;

function Piece(_board, _options) {
  _.extend(this, _.defaultsDeep(_options, optionDefaults));
  this.board = _board;
  this.id = ++id;
  this.possibleMoves = parseParlett(this.parlett, this);
}

Piece.prototype.possibleCaptures = function() { };

Piece.prototype.moveTo = function(x, y) {
  if (!(x < 0 || x >= this.board.size.width || y < 0 || y > this.board.size.height)) {

  }
};

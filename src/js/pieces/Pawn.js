module.exports = Pawn;

var Piece = require('./Piece');
var util = require('util');
var _ = require('lodash');

function Pawn() {
  Piece.apply(this, arguments);
}
util.inherits(Pawn, Piece);

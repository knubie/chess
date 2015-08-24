module.exports = Pawn;

var Piece = require('./Piece');
var util = require('util');
var _ = require('lodash');

function Pawn() {
  this.parlett = 'dn+';
  Piece.apply(this, arguments);
}
Pawn.prototype = Object.create(Piece.prototype);

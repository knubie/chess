var R = require('ramda');
var check    = require('./lib/type-checker').checkAll;
var Errors = require('./Errors');
var pieces = require('./Pieces');
var Colors = require('./Constants').Colors;
for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}

// TODO: R.assoc break this patter because it copies prototypes as well.
// will need to assign the opts obj onto a this.__value member to avoid that.

//  Game { turn :: String, board :: Board }
var Game = function(opts) {
  check([opts, opts.turn, opts.board], [Object, String, Board]);
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
}
Game.of = function(x) { return new Game(x); };
Game.className = 'Game';

// Board { size :: Number, pieces :: [Piece] }
var Board = function(opts) {
  check([opts, opts.size, opts.pieces], [Object, Number, [Piece]]);
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
}

Board.of = function(x) { return new Board(x); };
//Board.prototype.map = function(f){
  //return Board.of(f(this))
//}
Board.className = 'Board';

// Piece { name :: String, color :: String, position :: Position }
var Piece = function(opts) {
  check([opts,   opts.name, opts.color, opts.position],
        [Object, String,    String,     Position]);
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };

  this.parlett = this.parlett || pieces[opts.name].parlett;
  this.moves = this.moves || 0;
  this.captures = this.captures || 0;
  this.onCapture = pieces[opts.name].onCapture || identity;
}

Piece.of = function(x) { return new Piece(x); };
//Piece.prototype.map = function(f){
  //return Piece.of(f(this))
//}
Piece.className = 'Piece';

// Position { x :: Number, y :: Number }
var Position = function(opts) {
  check([opts, opts.x, opts.y], [Object, Number, Number]);
  if (typeof opts != 'object'
    || typeof opts.x != 'number'
    || typeof opts.y != 'number') {
    throw new Errors.TypeClassError('Invalid Position options.');
  }
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
}

Position.of = function(x) { return new Position(x); };
//Position.prototype.map = function(f){
  //return Position.of(f(this))
//}
Position.className = 'Position';

module.exports = { Game: Game, Board: Board, Piece: Piece, Position: Position };

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
function Game(opts) {
  check([opts, opts.turn, opts.board], [Object, String, Board]);
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };
  this.plys = this.plys || [];
}
Game.of = function(x) { return new Game(x); };

// Board { size :: Number, pieces :: [Piece] }
function Board(opts) {
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

// Piece { name :: String, color :: String, position :: Position }
function Piece(opts) {
  check([opts,   opts.name, opts.color, opts.position],
        [Object, String,    String,     Position]);
  for (k in opts) {
    if (opts.hasOwnProperty(k)) {
      this[k] = opts[k];
    }
  };

  if (pieces[opts.name].points == null) {
    throw new Errors.TypeClassError(opts.name + ' Piece needs a point value.');
  }
  if (pieces[opts.name].parlett == null) {
    throw new Errors.TypeClassError(opts.name + ' Piece needs a parlett value.');
  }

  this.parlett = this.parlett || pieces[opts.name].parlett;
  this.points = this.points || pieces[opts.name].points;
  this.royal = this.royal || pieces[opts.name].royal;
  this.moves = this.moves || 0;
  this.captures = this.captures || 0;
  this.onCapture = pieces[opts.name].onCapture || identity;
}

Piece.of = function(x) { return new Piece(x); };
//Piece.prototype.map = function(f){
  //return Piece.of(f(this))
//}

// Position { x :: Number, y :: Number }
function Position(opts) {
  check([opts, opts.x, opts.y], [Object, Number, Number]);
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

module.exports = { Game: Game, Board: Board, Piece: Piece, Position: Position };

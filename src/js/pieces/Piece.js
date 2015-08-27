var R = require('ramda');

var parseParlett = require('../parlett/parseParlett');

var _id = 0;

// @Abstract
var Piece = {
  _new: function(_child, options, board) {
    var _self = R.merge(_child, options);

    _self.id = _id++;
    _self.possibleMoves = parseParlett(board);

    return _self;
  }
};

module.exports = Piece;

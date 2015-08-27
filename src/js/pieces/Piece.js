var R = require('ramda');

var parseParlett = require('../parlett/parseParlett');

var _id = 0;

// @Abstract
var Piece = {
  _new: function(_child) {
    return {
      id: _id++,
      possibleMoves: parseParlett(_child.parlett, _child)
    };
  }
};

module.exports = Piece;

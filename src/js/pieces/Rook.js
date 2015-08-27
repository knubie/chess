var Piece = require('./Piece');
var R = require('ramda');

var Rook = {
  _new: function() {
    var _self = {
      parlett: [{
        direction: '+',
        distance: 'n'
      }]
    };

    _self = Piece._new(_self);

    return _self;
  }
};

module.exports = Rook;

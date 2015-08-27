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

    _self = R.merge(_self, R.apply(Piece._new, R.concat([_self], Array.prototype.slice.call(arguments))));

    return _self;
  }
};

module.exports = Rook;

var R = require('ramda');
for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}
module.exports = {
  'perception': {
    points: 1,
  },
  'pawn': {
    points: 1
  },
  'bishop': {
    points: 3
  },
  'knight': {
    points: 3
  },
  'rook': {
    points: 5
  },
  'queen': {
    points: 9
  },
  'king': {
    points: 5,
  },
  ///////// Custom pieces //////////
  'warlord': {
    points: 8,
  },
  'cannon': {
    points: 9,
  },
  'ranger': {
    points: 3,
  },
  'bloodlust': {
    points: 2,
  },
  'shapeshifter': {
    points: 2
  },
  'bomber': {
    points: 3,
  },
  'wall': {
    points: 4,
  },
  //'mine': {
    //points: 5
  //},
  'thief': {
    points: 4
  },
  'teleporter': {
    points: 3
  },
  ////////// Fairies //////////
  'berolina': {
    points: 1
  },
  'dabbaba': {
    points: 2
  },
  'alfil': {
    points: 2
  },
  'wazir': {
    points: 1.5
  },
  'ferz': {
    points: 1.5
  },
  'archbishop': {
    points: 7
  },
  'empress': {
    points: 8
  },
  'nightrider': {
    points: 9
  },
};

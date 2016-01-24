// TODO: make moveType optional.
var R = require('ramda');
for (var k in R) {
  var topLevel = typeof global === 'undefined' ? window : global;
  topLevel[k] = R[k];
}
module.exports = {
  'pawn': {
    parlett: [
      {
        conditions: ['i', 'o'],
        movement: '1/0',
        distance: '2',
        direction: 'forwards'
      },
      {
        conditions: ['o'],
        movement: '1/0',
        distance: '1',
        direction: 'forwards'
      },
      {
        conditions: ['c'],
        movement: '1/1',
        distance: '1',
        direction: 'forwards'
      }
    ],
    points: 1
  },
  'rook': {
    parlett: [{
      movement: '1/0',
      distance: 'n'
    }],
    points: 5
  },
  'bishop': {
    parlett: [{
      movement: '1/1',
      distance: 'n'
    }],
    points: 3.5
  },
  'knight': {
    parlett: [{
      movement: '1/2',
      distance: '1'
    }],
    points: 3
  },
  'queen': {
    parlett: [
      {
        movement: '1/1',
        distance: 'n'
      },
      {
        movement: '1/0',
        distance: 'n'
      }
    ],
    points: 8
  },
  'king': {
    parlett: [
      {
        movement: '1/1',
        distance: '1'
      },
      {
        movement: '1/0',
        distance: '1'
      }
    ],
    points: 5,
    types: ['royal']
  },
  ///////// Custom pieces //////////
  'cannon': {
    parlett: [
      {
        conditions: ['o'],
        movement: '1/0',
        distance: '1'
      },
      {
        conditions: ['c'],
        movement: '1/0',
        direction: 'forwards',
        distance: '5'
      }
    ],
    points: 12,
    types: ['ranged']
  },
  'ranger': {
    parlett: [
      {
        conditions: ['o'],
        movement: '1/1',
        distance: '3'
      },
      {
        conditions: ['c'],
        movement: '1/1',
        distance: '4'
      }
    ],
    points: 3,
    types: ['ranged']
  },
  'bloodlust': {
    parlett: [
      {
        movement: '1/1',
        distance: '1'
      },
      {
        movement: '1/0',
        distance: '1'
      }
    ],
    points: 5,
    // onCapture :: Piece -> Piece
    onCapture: evolve({
      // FIXME: distance is a string.
      parlett: map(evolve({ distance: add(1) }))
    })
  },
  'shapeshifter': {
    parlett: [
      {
        distance: '1',
        movement: '1/0'
      },
      {
        distance: '1',
        movement: '1/1'
      }
    ],
    points: 2.5
  },
  'bomber': {
    parlett: [
      {
        conditions: ['o'],
        movement: '1/1',
        distance: '1'
      },
      {
        conditions: ['o'],
        movement: '1/0',
        distance: '1'
      }
    ],
    points: 3,
    ability: function(board) {
    },
    // onCaptureBoard :: Board -> Board
    onCaptureBoard: function(board) {
      return evolve({
        pieces: reject(
          compose(
            flip(contains( append(this.position, getMoves(board, this)) )),
            prop('position')
          )
        )
      }, board);
    }
  },
  'wall': {
    parlett: [
      {
        movement: '0/0',
        distance: '0'
      }
    ],
    points: 2,
    types: ['invincible']
  },
  'mine': {
    parlett: [
      {
        movement: '0/0',
        distance: '0'
      }
    ],
    points: 5
  },
  'warlord': {
    parlett: [
      {
        movement: '1/1',
        distance: '2'
      },
      {
        movement: '1/0',
        distance: '2'
      }
    ],
    points: 8,
    types: ['royal']
  },
  'teleporter': {
    parlett: [],
    points: 3
  },
  ////////// Fairies //////////
  'dabbaba': {
    parlett: [{
      movement: '2/0',
      distance: '1'
    }],
    points: 2
  },
  'alfil': {
    parlett: [{
      movement: '2/2',
      distance: '1'
    }],
    points: 2
  },
  'wazir': {
    parlett: [{
      movement: '1/0',
      distance: '1'
    }],
    points: 1.5
  },
  'ferz': {
    parlett: [{
      movement: '1/1',
      distance: '1'
    }],
    points: 1.5
  },
  'archbishop': {
    parlett: [
      {
        movement: '1/2',
        distance: '1'
      },
      {
        moveType: 'default',
        movement: '1/1',
        distance: 'n'
      }
    ],
    points: 7
  },
  'empress': {
    parlett: [
      {
        movement: '1/2',
        distance: '1'
      },
      {
        moveType: 'default',
        movement: '1/0',
        distance: 'n'
      }
    ],
    points: 8
  },
  'nightrider': {
    parlett: [{
      movement: '1/2',
      distance: 'n'
    }],
    points: 9
  },
  'berolina': {
    parlett: [
      {
        conditions: ['i', 'o'],
        movement: '1/1',
        direction: 'forwards',
        distance: '2'
      },
      {
        conditions: ['o'],
        movement: '1/1',
        direction: 'forwards',
        distance: '1'
      },
      {
        conditions: ['c'],
        movement: '1/0',
        direction: 'forwards',
        distance: '1'
      }
    ],
    points: 2
  },
};


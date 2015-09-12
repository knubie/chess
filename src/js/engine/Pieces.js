// TODO: make moveType optional.
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
    royal: true
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
        moveType: 'gun',
        movement: '1/0',
        distance: 'n'
      },
      {
        conditions: ['c'],
        moveType: 'gun',
        movement: '1/1',
        distance: 'n'
      }
    ]
  },
  ////////// Fairies //////////
  'dabbaba': {
    parlett: [{
      movement: '2/0',
      distance: '1'
    }]
  },
  'alfil': {
    parlett: [{
      movement: '2/2',
      distance: '1'
    }]
  },
  'wazir': {
    parlett: [{
      movement: '1/0',
      distance: '1'
    }]
  },
  'ferz': {
    parlett: [{
      movement: '1/1',
      distance: '1'
    }]
  },
  'princess': {
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
    ]
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
    ]
  },
  'nightrider': {
    parlett: [{
      movement: '1/2',
      distance: 'n'
    }]
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
    ]
  },
};


// TODO: make moveType optional.
module.exports = {
  'pawn': {
    parlett: [
      {
        conditions: ['i', 'o'],
        moveType: 'default',
        direction: '>',
        distance: '2'
      },
      {
        conditions: ['o'],
        moveType: 'default',
        direction: '>',
        distance: '1'
      },
      {
        conditions: ['c'],
        moveType: 'default',
        direction: 'X>',
        distance: '1'
      }
    ],
    points: 1
  },
  'rook': {
    parlett: [{
      moveType: 'default',
      direction: '+',
      distance: 'n'
    }],
    points: 5
  },
  'bishop': {
    parlett: [{
      moveType: 'default',
      direction: 'X',
      distance: 'n'
    }],
    points: 3.5
  },
  'knight': {
    parlett: [{
      moveType: '~',
      direction: '1/2',
      distance: '1'
    }],
    points: 3
  },
  'queen': {
    parlett: [
      {
        moveType: 'default',
        direction: 'X',
        distance: 'n'
      },
      {
        moveType: 'default',
        direction: '+',
        distance: 'n'
      }
    ],
    points: 8
  },
  'king': {
    parlett: [
      {
        moveType: 'default',
        direction: 'X',
        distance: '1'
      },
      {
        moveType: 'default',
        direction: '+',
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
        moveType: 'default',
        direction: '+',
        distance: '1'
      },
      {
        conditions: ['c'],
        moveType: 'gun',
        direction: '+',
        distance: 'n'
      },
      {
        conditions: ['c'],
        moveType: 'gun',
        direction: 'X',
        distance: 'n'
      }
    ]
  },
  ////////// Fairies //////////
  'dabbaba': {
    parlett: [{
      moveType: '~',
      direction: '2/0',
      distance: '1'
    }]
  },
  'alfil': {
    parlett: [{
      moveType: '~',
      direction: '2/2',
      distance: '1'
    }]
  },
  'wazir': {
    parlett: [{
      moveType: 'default',
      direction: '+',
      distance: '1'
    }]
  },
  'ferz': {
    parlett: [{
      moveType: 'default',
      direction: 'X',
      distance: '1'
    }]
  },
  'princess': {
    parlett: [
      {
        moveType: '~',
        direction: '1/2',
        distance: '1'
      },
      {
        moveType: 'default',
        direction: 'X',
        distance: 'n'
      }
    ]
  },
  'empress': {
    parlett: [
      {
        moveType: '~',
        direction: '1/2',
        distance: '1'
      },
      {
        moveType: 'default',
        direction: '+',
        distance: 'n'
      }
    ]
  },
  'nightrider': {
    parlett: [{
      moveType: '~',
      direction: '1/2',
      distance: 'n'
    }]
  },
  'berolina': {
    parlett: [
      {
        conditions: ['i', 'o'],
        moveType: 'default',
        direction: 'X>',
        distance: '2'
      },
      {
        conditions: ['o'],
        moveType: 'default',
        direction: 'X>',
        distance: '1'
      },
      {
        conditions: ['c'],
        moveType: 'default',
        direction: '>',
        distance: '1'
      }
    ]
  },
};


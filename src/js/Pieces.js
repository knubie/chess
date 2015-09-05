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
    ]
  },
  'rook': {
    parlett: [{
      moveType: 'default',
      direction: '+',
      distance: 'n'
    }]
  },
  'bishop': {
    parlett: [{
      moveType: 'default',
      direction: 'X',
      distance: 'n'
    }]
  },
  'knight': {
    parlett: [{
      moveType: '~',
      direction: '1/2',
      distance: '1'
    }]
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
    ]
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


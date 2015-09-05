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
};


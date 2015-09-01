module.exports = {
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


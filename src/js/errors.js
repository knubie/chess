var util = require('util');

var TypeClassError = function(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.message = message;
  this.name = 'TypeClassError';
}

util.inherits(TypeClassError, Error);

module.exports = { TypeClassError: TypeClassError };

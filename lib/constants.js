var createSingleton;

createSingleton = require('./constant-utilities').createSingleton;

module.exports = {
  end: createSingleton('end'),
  none: createSingleton('none'),
  postpone: createSingleton('postpone')
};

var anyPostponement, equalsPostpone, hasPostpone, isCell, isPostponed, postpone, writePostpone;

isCell = require('./cell-utilities').isCell;

postpone = require('./constants').postpone;

anyPostponement = function(args) {
  return args.some(isPostponed);
};

equalsPostpone = function(value) {
  return value === postpone;
};

hasPostpone = function(value) {
  return isCell(value) && isPostponed(value.read());
};

isPostponed = function(value) {
  return equalsPostpone(value) || hasPostpone(value);
};

writePostpone = function(cell) {
  return cell.write(postpone);
};

module.exports = {
  anyPostponement: anyPostponement,
  isPostponed: isPostponed,
  writePostpone: writePostpone
};

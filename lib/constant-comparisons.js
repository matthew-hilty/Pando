var end, isEnd, isNonTerminal, isRelevant, none, postpone, _ref;

_ref = require('./constants'), end = _ref.end, none = _ref.none, postpone = _ref.postpone;

isEnd = function(value) {
  return value === end;
};

isNonTerminal = function(value) {
  return !isEnd(value);
};

isRelevant = function(value) {
  return value !== none;
};

module.exports = {
  isEnd: isEnd,
  isNonTerminal: isNonTerminal,
  isRelevant: isRelevant
};

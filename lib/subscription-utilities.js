var filteringNonterminal, onFirstAndOnlyValue, onValue, permittingOnlyOneValue, transubscribe, _ref;

_ref = require('./transforms'), filteringNonterminal = _ref.filteringNonterminal, permittingOnlyOneValue = _ref.permittingOnlyOneValue;

transubscribe = function(transmerse) {
  return function(dispatcher, sink) {
    return dispatcher.subscribe(transmerse(sink));
  };
};

onFirstAndOnlyValue = transubscribe(permittingOnlyOneValue);

onValue = transubscribe(filteringNonterminal);

module.exports = {
  onFirstAndOnlyValue: onFirstAndOnlyValue,
  onValue: onValue,
  transubscribe: transubscribe
};

var attempt, bfiltering, bfilteringNonterminal, bindBeforeTransmersal, bindIdentification, blockTillReady, blocking, bmapping, compose, composing, delaying, doAsync, filtering, filteringDefined, filteringNonterminal, flattening, functionize, isDefined, isEnd, isNonTerminal, isRelevant, mapping, mappingEnd, monitoringFirst, monitoringLatest, negating, noOp, permittingOnlyOneValue, reducing, scanning, sinkIfSinkable, staggering, stateMachineProcessing, taking, _ref, _ref1, _ref2, _ref3, _ref4,
  __slice = [].slice;

_ref = require('./scheduling'), attempt = _ref.attempt, blockTillReady = _ref.blockTillReady, doAsync = _ref.doAsync;

_ref1 = require('./utilities'), compose = _ref1.compose, isDefined = _ref1.isDefined, noOp = _ref1.noOp;

_ref2 = require('./constant-comparisons'), isEnd = _ref2.isEnd, isNonTerminal = _ref2.isNonTerminal, isRelevant = _ref2.isRelevant;

_ref3 = require('./transform-utilities'), bindBeforeTransmersal = _ref3.bindBeforeTransmersal, bindIdentification = _ref3.bindIdentification, functionize = _ref3.functionize, sinkIfSinkable = _ref3.sinkIfSinkable;

composing = function() {
  var fns;
  fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return function(sink) {
    return function(value, sourceID, sid) {
      var _sink;
      if (isEnd(value)) {
        return sink(value, sourceID, sid);
      } else {
        _sink = bindIdentification(sink, sourceID, sid);
        return attempt(_sink, compose(fns.concat(value)));
      }
    };
  };
};

delaying = function(delayDuration) {
  return function(sink) {
    return function(value, sourceID, sid) {
      return setInterval((function() {
        return sink(value, sourceID, sid);
      }), delayDuration);
    };
  };
};

filtering = function(pred) {
  return function(sink) {
    return function(value, sourceID, sid) {
      var _sink;
      if (isEnd(value)) {
        return sink(value, sourceID, sid);
      } else {
        _sink = bindIdentification(sink, sourceID, sid);
        return attempt(sinkIfSinkable(_sink), value, doAsync(pred)(value));
      }
    };
  };
};

filteringNonterminal = function(sink) {
  return function(value, sourceID, sid) {
    if (isNonTerminal(value)) {
      return sink(value, sourceID, sid);
    }
  };
};

flattening = function(sink) {
  var subscriptions, unsub;
  subscriptions = [];
  unsub = function() {
    return subscriptions.forEach(function(unsubscribe) {
      return unsubscribe();
    });
  };
  return function(dispatcher, sourceID, sid) {
    if (isEnd(dispatcher)) {
      unsub();
      return sink(end, sourceID, sid);
    } else {
      return subscriptions.push(dispatcher.subscribe(sink));
    }
  };
};

mapping = function() {
  var arg, args, fn;
  arg = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  fn = functionize.apply(null, [arg].concat(__slice.call(args)));
  return function(sink) {
    return function(value, sourceID, sid) {
      var _sink;
      if (isEnd(value)) {
        return sink(value, sourceID, sid);
      } else {
        _sink = bindIdentification(sink, sourceID, sid);
        return attempt(_sink, fn(value));
      }
    };
  };
};

mappingEnd = function(thunk) {
  return function(sink) {
    return function(value, sourceID, sid) {
      var _value;
      _value = isEnd(value) ? thunk() : value;
      return sink(_value, sourceID, sid);
    };
  };
};

monitoringFirst = function(sink) {
  var isAccepting, unsub;
  isAccepting = true;
  unsub = noOp;
  return function(dispatcher, sourceID, sid) {
    if (isEnd(dispatcher)) {
      unsub();
      sink(end, sourceID, sid);
    }
    if (isAccepting) {
      isAccepting = false;
      return unsub = dispatcher.subscribe(sink);
    }
  };
};

monitoringLatest = function(sink) {
  var unsub;
  unsub = noOp;
  return function(dispatcher, sourceID, sid) {
    if (isEnd(dispatcher)) {
      unsub();
      return sink(end, sourceID, sid);
    } else {
      return unsub = dispatcher.subscribe(sink);
    }
  };
};

permittingOnlyOneValue = function(sink) {
  return function(value, sourceID, sid) {
    var _sink;
    _sink = bindIdentification(sink, sourceID, sid);
    _sink(value);
    return _sink(end);
  };
};

reducing = function(memo) {
  return function(fn) {
    return function(sink) {
      var cachedValue;
      cachedValue = memo;
      return function(value, sourceID, sid) {
        if (isNonTerminal(value)) {
          return cachedValue = fn(cachedValue)(value);
        } else {
          return sink(cachedValue, sourceID, sid);
        }
      };
    };
  };
};

scanning = function(memo) {
  return function(fn) {
    return function(sink) {
      var cachedValue;
      cachedValue = memo;
      return function(value, sourceID, sid) {
        var _sink;
        _sink = bindIdentification(sink, sourceID, sid);
        if (isEnd(value)) {
          return _sink(value);
        } else {
          cachedValue = fn(cachedValue)(value);
          return _sink(cachedValue);
        }
      };
    };
  };
};

staggering = function(offset) {
  return function(sink) {
    var cache, isSinking;
    cache = [];
    isSinking = false;
    return function(value, sourceID, sid) {
      var args;
      cache.push([value, sourceID, sid]);
      if (isSinking) {
        args = cache.shift();
        return sink.apply(null, args);
      } else {
        offset = offset - 1;
        return isSinking = offset === 0;
      }
    };
  };
};

stateMachineProcessing = function(initialState, fn) {
  return function(sink) {
    return function(value, sourceID, sid) {
      var newState, newValue, state, _ref4;
      state = initialState;
      _ref4 = fn(state)(value), newState = _ref4.newState, newValue = _ref4.newValue;
      state = newState;
      return sink(newValue, sourceID, sid);
    };
  };
};

taking = function(nbr) {
  return function(sink) {
    var iteration;
    iteration = nbr;
    return function(value, sourceID, sid) {
      if (iteration > 0) {
        iteration = iteration - 1;
        return sink(value, sourceID, sid);
      } else {
        return sink(end, sourceID, sid);
      }
    };
  };
};

_ref4 = [filtering, filteringNonterminal, mapping].map(bindBeforeTransmersal), bfiltering = _ref4[0], bfilteringNonterminal = _ref4[1], bmapping = _ref4[2];

blocking = blockTillReady;

filteringDefined = filtering(isDefined);

negating = mapping(function(bool) {
  return !bool;
});

module.exports = {
  bfiltering: bfiltering,
  bfilteringNonterminal: bfilteringNonterminal,
  blocking: blocking,
  bmapping: bmapping,
  composing: composing,
  delaying: delaying,
  filtering: filtering,
  filteringDefined: filteringDefined,
  filteringNonterminal: filteringNonterminal,
  flattening: flattening,
  mapping: mapping,
  mappingEnd: mappingEnd,
  monitoringFirst: monitoringFirst,
  monitoringLatest: monitoringLatest,
  negating: negating,
  permittingOnlyOneValue: permittingOnlyOneValue,
  reducing: reducing,
  staggering: staggering,
  stateMachineProcessing: stateMachineProcessing,
  scanning: scanning,
  taking: taking
};

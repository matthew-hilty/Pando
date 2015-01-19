var fromArray, fromCallback, fromDelayedValue, fromDispatcher, fromEventTarget, fromFinitePeriodicSequence, fromInternalDispatchOnly, fromMerger, fromPoll, fromSourceFunction, generateID, register, returnNoOp, _ref, _ref1;

_ref = require('./registrations'), generateID = _ref.generateID, register = _ref.register;

returnNoOp = require('./utilities').returnNoOp;

fromArray = function(array) {
  return function(sink) {
    var id, index, isAvailable, length, unsubscribe;
    isAvailable = true;
    id = generateID();
    index = 0;
    length = array.length;
    unsubscribe = function() {
      return isAvailable = false;
    };
    register({
      id: id,
      unsubscribe: unsubscribe
    });
    while (isAvailable) {
      if (index < length) {
        sink(array[index++], id, "Array-" + id);
      } else {
        sink(end, id, "Array-" + id);
      }
    }
    return unsubscribe;
  };
};

fromCallback = function(useAsCallback, stopUsingAsCallback) {
  return function(sink) {
    var _sink;
    if (stopUsingAsCallback == null) {
      stopUsingAsCallback = returnNoOp;
    }
    _sink = function(val) {
      sink(val);
      return sink(end);
    };
    useAsCallback(_sink);
    return function() {
      return stopUsingAsCallback(_sink);
    };
  };
};

fromDelayedValue = function(value) {
  return fromFinitePeriodicSequence([value]);
};

fromDispatcher = function(dispatcher) {
  return dispatcher.subscribe;
};

fromFinitePeriodicSequence = function(values) {
  var index, len;
  index = 0;
  len = values.length;
  return fromPoll(function(sink) {
    var val;
    val = values[index];
    index += 1;
    sink(val);
    if (index === len) {
      return sink(end);
    }
  });
};

fromEventTarget = function(domTgt) {
  return function(eventName) {
    return function(sink) {
      var sub, unsub, _ref1, _ref2, _ref3, _ref4;
      sub = (_ref1 = domTgt.addEventListener) != null ? _ref1 : (_ref2 = domTgt.addListener) != null ? _ref2 : domTgt.bind;
      unsub = (_ref3 = domTgt.removeEventListener) != null ? _ref3 : (_ref4 = domTgt.removeListener) != null ? _ref4 : domTgt.unbind;
      sub.call(domTgt, eventName, sink);
      return function() {
        return unsub.call(domTgt, eventName);
      };
    };
  };
};

fromInternalDispatchOnly = returnNoOp;

fromMerger = function(dispatchers) {
  return function(sink) {
    var subscriptions;
    subscriptions = [];
    dispatchers.forEach(function(dispatcher) {
      return subscriptions.push(dispatcher.subscribe(sink));
    });
    return function() {
      return subscriptions.forEach(function(unsubscribe) {
        return unsubscribe();
      });
    };
  };
};

fromPoll = function(transformSink) {
  return function(delayDuration) {
    return function(sink) {
      var pollID;
      pollID = setInterval(transformSink(sink), delayDuration);
      return function() {
        return clearInterval(pollID);
      };
    };
  };
};

fromSourceFunction = function(subscribe, unsubscribe) {
  return function(sink) {
    if (unsubscribe == null) {
      unsubscribe = returnNoOp;
    }
    subscribe(sink);
    return function() {
      return unsubscribe(sink);
    };
  };
};

module.exports = (_ref1 = require('./source-determiners'), fromArray = _ref1.fromArray, fromCallback = _ref1.fromCallback, fromDelayedValue = _ref1.fromDelayedValue, fromDispatcher = _ref1.fromDispatcher, fromEventTarget = _ref1.fromEventTarget, fromFinitePeriodicSequence = _ref1.fromFinitePeriodicSequence, fromInternalDispatchOnly = _ref1.fromInternalDispatchOnly, fromMerger = _ref1.fromMerger, fromPoll = _ref1.fromPoll, fromSourceFunction = _ref1.fromSourceFunction, _ref1);

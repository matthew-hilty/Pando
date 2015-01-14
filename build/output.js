!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Pando=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var CoreCell, createCell, cytolyse, cytolyseAll, extendProto, getType, isCell, _ref;

CoreCell = _dereq_('./core-types').CoreCell;

_ref = _dereq_('./utilities'), extendProto = _ref.extendProto, getType = _ref.getType;

createCell = function(initialValue) {
  var read, value, write;
  value = initialValue != null ? initialValue : null;
  read = function() {
    return value;
  };
  write = function(_value) {
    return value = _value;
  };
  return extendProto(CoreCell, {
    read: read,
    write: write
  });
};

isCell = function(val) {
  return getType(val) === CoreCell;
};

cytolyse = function(val) {
  if (isCell(val)) {
    return cytolyse(val.read());
  } else {
    return val;
  }
};

cytolyseAll = function(args) {
  return args.map(cytolyse);
};

module.exports = {
  createCell: createCell,
  cytolyse: cytolyse,
  cytolyseAll: cytolyseAll,
  isCell: isCell
};



},{"./core-types":7,"./utilities":23}],2:[function(_dereq_,module,exports){
var anyPostponedArgs, anyPostponement, configReschedule, defaultConfig, extend, noOp, parseConfig, reschedule, _ref, _ref1,
  __slice = [].slice;

_ref = _dereq_('./postponement-utilities'), anyPostponedArgs = _ref.anyPostponedArgs, anyPostponement = _ref.anyPostponement;

_ref1 = _dereq_('./utilities'), extend = _ref1.extend, noOp = _ref1.noOp;

configReschedule = function() {
  var N, args, config, onRelease, onReschedule, shouldReschedule, _config;
  _config = arguments[0], N = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  config = parseConfig(_config);
  onRelease = config.onRelease, onReschedule = config.onReschedule, shouldReschedule = config.shouldReschedule;
  if (shouldReschedule(args)) {
    onReschedule.apply(null, args);
    if (N > 0) {
      reschedule(function() {
        return configReschedule.apply(null, [config, N - 1].concat(__slice.call(args)));
      });
    }
  } else {
    onRelease.apply(null, args);
  }
  return args[0];
};

parseConfig = function(config) {
  return extend({}, defaultConfig, config);
};

reschedule = function(thunk) {
  return setTimeout(thunk, 0);
};

defaultConfig = {
  onReschedule: noOp,
  shouldReschedule: anyPostponement
};

module.exports = {
  configReschedule: configReschedule,
  reschedule: reschedule
};



},{"./postponement-utilities":16,"./utilities":23}],3:[function(_dereq_,module,exports){
var connect, generateID;

generateID = _dereq_('./registrations').generateID;

connect = function(src, tgt, transform) {
  var dispatch, newSink, subscription;
  dispatch = tgt.dispatch;
  if (transform == null) {
    transform = identity;
  }
  newSink = transform(dispatch);
  if (newSink === dispatch) {
    return src.subscribe(newSink);
  }
  subscription = function(value, sourceID) {
    return newSink(value, sourceID, subscription.id);
  };
  subscription.id = generateID();
  return src.subscribe(subscription);
};

module.exports = connect;



},{"./registrations":17}],4:[function(_dereq_,module,exports){
var end, isEnd, isNonTerminal, isRelevant, none, postpone, _ref;

_ref = _dereq_('./constants'), end = _ref.end, none = _ref.none, postpone = _ref.postpone;

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



},{"./constants":6}],5:[function(_dereq_,module,exports){
var bracket, createSingleton;

bracket = function(label) {
  return '<' + label + '>';
};

createSingleton = function(label) {
  return {
    inspect: function() {
      return bracket(label);
    }
  };
};

module.exports = {
  bracket: bracket,
  createSingleton: createSingleton
};



},{}],6:[function(_dereq_,module,exports){
var createSingleton;

createSingleton = _dereq_('./constant-utilities').createSingleton;

module.exports = {
  end: createSingleton('end'),
  none: createSingleton('none'),
  postpone: createSingleton('postpone')
};



},{"./constant-utilities":5}],7:[function(_dereq_,module,exports){
var CoreCell, CoreDispatcher, bracket, createSuperType, display, displayCellType, displayDispatcherType, extendProto, isFromType, _ref;

bracket = _dereq_('./constant-utilities').bracket;

_ref = _dereq_('./utilities'), extendProto = _ref.extendProto, isFromType = _ref.isFromType;

display = function(supertype) {
  return function(subtype) {
    return function() {
      return bracket("" + supertype + ": " + subtype);
    };
  };
};

createSuperType = function(display, typeLabel) {
  return {
    inspect: display('Core'),
    supertype: typeLabel,
    type: typeLabel
  };
};

displayCellType = display('Cell');

displayDispatcherType = display('Dispatcher');

CoreCell = createSuperType(displayCellType, 'core-cell');

CoreDispatcher = createSuperType(displayDispatcherType, 'core-dispatcher');

module.exports = {
  CoreCell: CoreCell,
  CoreDispatcher: CoreDispatcher,
  displayDispatcherType: displayDispatcherType
};



},{"./constant-utilities":5,"./utilities":23}],8:[function(_dereq_,module,exports){
var CoreDispatcher, anyPostponement, callOnlyOnce, configReschedule, createDispatcherType, cytolyse, eachProperty, extendProto, generateID, identity, isEnd, isInitiatingDagUpdate, noOp, parseOpts, register, resetDagUpdateProcess, returnNoOp, _createDispatcherType, _ref, _ref1, _ref2;

_ref = _dereq_('./dag-status'), isInitiatingDagUpdate = _ref.isInitiatingDagUpdate, resetDagUpdateProcess = _ref.resetDagUpdateProcess;

_ref1 = _dereq_('./utilities'), callOnlyOnce = _ref1.callOnlyOnce, eachProperty = _ref1.eachProperty, extendProto = _ref1.extendProto, identity = _ref1.identity, noOp = _ref1.noOp, returnNoOp = _ref1.returnNoOp;

anyPostponement = _dereq_('./postponement-utilities').anyPostponement;

configReschedule = _dereq_('./configure-rescheduling').configReschedule;

CoreDispatcher = _dereq_('./core-types').CoreDispatcher;

cytolyse = _dereq_('./cell-utilities').cytolyse;

_ref2 = _dereq_('./registrations'), generateID = _ref2.generateID, register = _ref2.register;

isEnd = _dereq_('./constant-comparisons').isEnd;

parseOpts = _dereq_('./parseOpts');

createDispatcherType = function(opts) {
  return function(source) {
    var dispatcher;
    dispatcher = _createDispatcherType(opts)(source);
    register(dispatcher);
    return dispatcher;
  };
};

_createDispatcherType = function(opts) {
  return function(source) {
    var activate, addSubscriber, alias, disconnectFrom, dispatch, dispatch_N, distribute, id, informSubscribers, mixins, properties, proto, releaseFromRescheduling, reschedulingConfig, setAlias, sinks, stopSourceInflux, subscribe, terminate, terminated_question_, transact, transformDispatch, transformSubscribe, unsubscribe, _dispatch, _ref3, _subscribe;
    _ref3 = parseOpts(opts), mixins = _ref3.mixins, proto = _ref3.proto, transformDispatch = _ref3.transformDispatch, transformSubscribe = _ref3.transformSubscribe;
    if (mixins == null) {
      mixins = {};
    }
    if (proto == null) {
      proto = CoreDispatcher;
    }
    if (source == null) {
      source = returnNoOp;
    }
    if (transformDispatch == null) {
      transformDispatch = identity;
    }
    if (transformSubscribe == null) {
      transformSubscribe = identity;
    }
    id = generateID();
    sinks = {};
    stopSourceInflux = noOp;
    terminated_question_ = false;
    alias = id;
    setAlias = function(val) {
      return alias = val;
    };
    activate = callOnlyOnce(function() {
      return stopSourceInflux = callOnlyOnce(source(dispatch));
    });
    addSubscriber = function(sink) {
      if (!sink.id) {
        sink.id = generateID();
      }
      return sinks[sink.id] = sink;
    };
    disconnectFrom = function(sourceID, sid) {
      var subscriptionID;
      subscriptionID = sid != null ? sid : id;
      if (sourceID) {
        return transmit(sourceID)('unsubscribe')(subscriptionID);
      }
    };
    _dispatch = function(value, sourceID, subscriptionID) {
      return dispatch_N(10, value, sourceID, subscriptionID);
    };
    dispatch_N = function(N, value, sourceID, sid) {
      return configReschedule(reschedulingConfig, N, value, sourceID, sid);
    };
    distribute = function(value) {
      var _distrib;
      if (isEnd(value)) {
        return terminate();
      } else {
        _distrib = function(sink) {
          return sink(value, id, sink.id || 'no-ID');
        };
        return eachProperty(_distrib, sinks);
      }
    };
    informSubscribers = function() {
      return eachProperty((function(sink) {
        return sink(end);
      }), sinks);
    };
    releaseFromRescheduling = function(value, sourceID, sid) {
      if (terminated_question_) {
        return disconnectFrom(sourceID, sid);
      } else {
        return transact(cytolyse(value), sourceID, sid);
      }
    };
    _subscribe = function(sink) {
      if (terminated_question_) {
        sink(end);
        return noOp;
      } else {
        addSubscriber(sink);
        activate();
        return callOnlyOnce(function() {
          return unsubscribe(sink);
        });
      }
    };
    terminate = function() {
      stopSourceInflux();
      terminated_question_ = true;
      informSubscribers();
      sinks = {};
      return removeFromRegistrar(id);
    };
    transact = function(value, sourceID, sid) {
      var hasInitiatedDagUpdate;
      hasInitiatedDagUpdate = isInitiatingDagUpdate();
      try {
        distribute(value);
        if (terminated_question_) {
          return disconnectFrom(sourceID, sid);
        }
      } finally {
        if (hasInitiatedDagUpdate) {
          resetDagUpdateProcess();
        }
      }
    };
    unsubscribe = function(val) {
      var subscriberID;
      subscriberID = isFunction(val) ? val.id : val;
      delete sinks[subscriberID];
      if (isEmpty(sinks)) {
        return terminate();
      }
    };
    reschedulingConfig = {
      onRelease: releaseFromRescheduling
    };
    dispatch = transformDispatch(_dispatch);
    subscribe = transformSubscribe(_subscribe, unsubscribe);
    dispatch.id = id;
    properties = {
      activate: activate,
      alias: alias,
      dispatch: dispatch,
      id: id,
      setAlias: setAlias,
      subscribe: subscribe,
      terminate: terminate,
      unsubscribe: unsubscribe
    };
    return extendProto(proto, properties, mixins);
  };
};

module.exports = createDispatcherType;



},{"./cell-utilities":1,"./configure-rescheduling":2,"./constant-comparisons":4,"./core-types":7,"./dag-status":9,"./parseOpts":15,"./postponement-utilities":16,"./registrations":17,"./utilities":23}],9:[function(_dereq_,module,exports){
var isDagUpdating, isInitiatingDagUpdate, isInitiatingUpdate, isUpdating, resetDagUpdateProcess;

isInitiatingUpdate = true;

isUpdating = false;

isDagUpdating = function() {
  return isUpdating;
};

isInitiatingDagUpdate = function() {
  var _isInitiatingUpdate;
  _isInitiatingUpdate = isInitiatingUpdate;
  isInitiatingUpdate = false;
  isUpdating = true;
  return _isInitiatingUpdate;
};

resetDagUpdateProcess = function() {
  isUpdating = false;
  return isInitiatingUpdate = true;
};

module.exports = {
  isDagUpdating: isDagUpdating,
  isInitiatingDagUpdate: isInitiatingDagUpdate,
  resetDagUpdateProcess: resetDagUpdateProcess
};



},{}],10:[function(_dereq_,module,exports){
var CoreDispatcher, EventStream, Property, isFromType, _ref;

CoreDispatcher = _dereq_('./core-types').CoreDispatcher;

_ref = _dereq_('./dispatcher-types'), EventStream = _ref.EventStream, Property = _ref.Property;

isFromType = _dereq_('./utilities').isFromType;

module.exports = {
  isDispatcher: isFromType(CoreDispatcher),
  isEventStream: isFromType(EventStream),
  isProperty: isFromType(Property)
};



},{"./core-types":7,"./dispatcher-types":12,"./utilities":23}],11:[function(_dereq_,module,exports){
var createDispatcherType, createEventStream, createEventStreamBus, createNonInitProperty, createNonInitPropertyBus, createProperty, createPropertyBus, fromInternalDispatchOnly, genESOpts, genNonInitPropOpts, genPropOpts, _ref;

createDispatcherType = _dereq_('./createDispatcherType');

fromInternalDispatchOnly = _dereq_('./source-determiners').fromInternalDispatchOnly;

_ref = _dereq_('./options-generators'), genESOpts = _ref.genESOpts, genNonInitPropOpts = _ref.genNonInitPropOpts, genPropOpts = _ref.genPropOpts;

createEventStreamBus = function() {
  return createEventStream()(fromInternalDispatchOnly);
};

createNonInitPropertyBus = function() {
  return createNonInitProperty()(fromInternalDispatchOnly);
};

createProperty = function(initialValue) {
  return function(__i) {
    return createDispatcherType(genPropOpts(initialValue)(__i));
  };
};

createPropertyBus = function(initialValue) {
  return createProperty(initialValue)()(fromInternalDispatchOnly);
};

createEventStream = (function(__i) {
  return createDispatcherType(genESOpts(__i));
});

createNonInitProperty = (function(__i) {
  return createDispatcherType(genNonInitPropOpts(__i));
});

module.exports = {
  createEventStream: createEventStream,
  createEventStreamBus: createEventStreamBus,
  createNonInitProperty: createNonInitProperty,
  createNonInitPropertyBus: createNonInitPropertyBus,
  createProperty: createProperty,
  createPropertyBus: createPropertyBus
};



},{"./createDispatcherType":8,"./options-generators":14,"./source-determiners":19}],12:[function(_dereq_,module,exports){
var CoreDispatcher, EventStream, Property, displayDispatcherType, extendCoreDispatcher, extendProto, _ref;

_ref = _dereq_('./core-types'), CoreDispatcher = _ref.CoreDispatcher, displayDispatcherType = _ref.displayDispatcherType;

extendProto = _dereq_('./utilities').extendProto;

extendCoreDispatcher = function(type) {
  var inspect;
  inspect = displayDispatcherType(type);
  return extendProto(CoreDispatcher, {
    inspect: inspect,
    type: type
  });
};

EventStream = extendCoreDispatcher('EventStream');

Property = extendCoreDispatcher('Property');

module.exports = {
  EventStream: EventStream,
  extendCoreDispatcher: extendCoreDispatcher,
  Property: Property
};



},{"./core-types":7,"./utilities":23}],13:[function(_dereq_,module,exports){
var blockTillReady, connect, createDispatcherType, doAsync, factories, isDispatcher, isEnd, isEventStream, isNonTerminal, isProperty, isRelevant, onFirstAndOnlyValue, onValue, predicates, sources, terminate, transforms, transubscribe, utilities, _ref, _ref1, _ref2, _ref3;

_ref = _dereq_('./scheduling'), blockTillReady = _ref.blockTillReady, doAsync = _ref.doAsync;

connect = _dereq_('./connect');

createDispatcherType = _dereq_('./createDispatcherType');

factories = _dereq_('./dispatcher-factories');

_ref1 = _dereq_('./constant-comparisons'), isEnd = _ref1.isEnd, isNonTerminal = _ref1.isNonTerminal, isRelevant = _ref1.isRelevant;

sources = _dereq_('./source-determiners');

terminate = _dereq_('./transform-utilities').terminate;

transforms = _dereq_('./transforms');

_ref2 = _dereq_('./dispatcher-comparisons'), isDispatcher = _ref2.isDispatcher, isEventStream = _ref2.isEventStream, isProperty = _ref2.isProperty;

_ref3 = _dereq_('./subscription-utilities'), onFirstAndOnlyValue = _ref3.onFirstAndOnlyValue, onValue = _ref3.onValue, transubscribe = _ref3.transubscribe;

predicates = {
  isDispatcher: isDispatcher,
  isEnd: isEnd,
  isEventStream: isEventStream,
  isNonTerminal: isNonTerminal,
  isProperty: isProperty,
  isRelevant: isRelevant
};

utilities = {
  blockTillReady: blockTillReady,
  connect: connect,
  createDispatcherType: createDispatcherType,
  doAsync: doAsync,
  onFirstAndOnlyValue: onFirstAndOnlyValue,
  onValue: onValue,
  terminate: terminate,
  transubscribe: transubscribe
};

module.exports = {
  factories: factories,
  predicates: predicates,
  sources: sources,
  transforms: transforms,
  utilities: utilities
};



},{"./connect":3,"./constant-comparisons":4,"./createDispatcherType":8,"./dispatcher-comparisons":10,"./dispatcher-factories":11,"./scheduling":18,"./source-determiners":19,"./subscription-utilities":20,"./transform-utilities":21,"./transforms":22}],14:[function(_dereq_,module,exports){
var EventStream, Property, configReschedule, createCell, extend, genESOpts, genNonInitPropOpts, genPropOpts, getSampleConfig, isDagUpdating, isEnd, isRelevant, noOp, none, parseOpts, postpone, writePostpone, _ref, _ref1, _ref2, _ref3;

configReschedule = _dereq_('./configure-rescheduling').configReschedule;

createCell = _dereq_('./cell-utilities').createCell;

_ref = _dereq_('./dispatcher-types'), EventStream = _ref.EventStream, Property = _ref.Property;

_ref1 = _dereq_('./utilities'), extend = _ref1.extend, noOp = _ref1.noOp;

isDagUpdating = _dereq_('./dag-status').isDagUpdating;

_ref2 = _dereq_('./constant-comparisons'), isEnd = _ref2.isEnd, isRelevant = _ref2.isRelevant;

_ref3 = _dereq_('./constants'), none = _ref3.none, postpone = _ref3.postpone;

parseOpts = _dereq_('./parseOpts');

writePostpone = _dereq_('./postponement-utilities').writePostpone;

genESOpts = function(opts) {
  var result;
  if (opts == null) {
    opts = {};
  }
  result = parseOpts(opts);
  result.proto = EventStream;
  return result;
};

genPropOpts = function(initialValue) {
  return function(opts) {
    var cachedValue, ended_question_, immediatelyEnd, mixins, proto, pushValueThru, read, sample, sample_N, transformDispatch, transformSubscribe, write, _ref4, _transformDispatch, _transformSubscribe;
    if (opts == null) {
      opts = {};
    }
    _ref4 = parseOpts(opts), mixins = _ref4.mixins, transformDispatch = _ref4.transformDispatch, transformSubscribe = _ref4.transformSubscribe;
    cachedValue = initialValue != null ? initialValue : none;
    ended_question_ = false;
    proto = Property;
    read = function() {
      return cachedValue;
    };
    sample = function() {
      return sample_N(10, createCell());
    };
    sample_N = function(N, cell) {
      return configReschedule(getSampleConfig(read), N, cell);
    };
    write = function(value) {
      return cachedValue = value;
    };
    extend(mixins, {
      read: read,
      sample: sample,
      write: write
    });
    pushValueThru = function(sink, value) {
      if (sink.id) {
        return sink(value, sink.id, '?1');
      } else {
        return sink(value, '?2', '?2');
      }
    };
    immediatelyEnd = function(sink) {
      pushValueThru(sink, end);
      return noOp;
    };
    _transformDispatch = function(dispatch) {
      return function(value, sourceID, sid) {
        if (isEnd(value)) {
          ended_question_ = true;
        } else {
          write(value);
        }
        return dispatch(value, sourceID, sid);
      };
    };
    _transformSubscribe = function(subscribe) {
      return function(sink) {
        if (isRelevant(cachedValue)) {
          pushValueThru(sink, cachedValue);
          if (ended_question_) {
            return immediatelyEnd(sink);
          } else {
            return subscribe(sink);
          }
        } else {
          return subscribe(sink);
        }
      };
    };
    return {
      mixins: mixins,
      proto: proto,
      transformDispatch: (function(__i) {
        return transformDispatch(_transformDispatch(__i));
      }),
      transformSubscribe: (function(__i) {
        return transformSubscribe(_transformSubscribe(__i));
      })
    };
  };
};

getSampleConfig = function(read) {
  return {
    onRelease: function(cell) {
      return cell.write(read());
    },
    onReschedule: writePostpone,
    shouldReschedule: isDagUpdating
  };
};

genNonInitPropOpts = genPropOpts(none);

module.exports = {
  genESOpts: genESOpts,
  genPropOpts: genPropOpts,
  genNonInitPropOpts: genNonInitPropOpts
};



},{"./cell-utilities":1,"./configure-rescheduling":2,"./constant-comparisons":4,"./constants":6,"./dag-status":9,"./dispatcher-types":12,"./parseOpts":15,"./postponement-utilities":16,"./utilities":23}],15:[function(_dereq_,module,exports){
var CoreDispatcher, identity, isFunction, parseOpts, _ref;

CoreDispatcher = _dereq_('./core-types').CoreDispatcher;

_ref = _dereq_('./utilities'), identity = _ref.identity, isFunction = _ref.isFunction;

parseOpts = function(opts) {
  var mixins, proto, transformDispatch, transformSubscribe;
  if (isFunction(opts)) {
    transformDispatch = opts;
  } else {
    mixins = opts.mixins, proto = opts.proto, transformDispatch = opts.transformDispatch, transformSubscribe = opts.transformSubscribe;
  }
  if (mixins == null) {
    mixins = {};
  }
  if (proto == null) {
    proto = CoreDispatcher;
  }
  if (transformDispatch == null) {
    transformDispatch = identity;
  }
  if (transformSubscribe == null) {
    transformSubscribe = identity;
  }
  return {
    mixins: mixins,
    proto: proto,
    transformDispatch: transformDispatch,
    transformSubscribe: transformSubscribe
  };
};

module.exports = parseOpts;



},{"./core-types":7,"./utilities":23}],16:[function(_dereq_,module,exports){
var anyPostponement, equalsPostpone, hasPostpone, isCell, isPostponed, postpone, writePostpone;

isCell = _dereq_('./cell-utilities').isCell;

postpone = _dereq_('./constants').postpone;

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



},{"./cell-utilities":1,"./constants":6}],17:[function(_dereq_,module,exports){
var entities, generateID, register, removeFromRegistrar, seed, transmit,
  __slice = [].slice;

generateID = function() {
  return seed++;
};

register = function(entity) {
  entities[entity.id] = entity;
  return entity;
};

removeFromRegistrar = function(id) {
  return delete entities[id];
};

transmit = function(id) {
  return function(message) {
    return function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (entities[id]) {
        return (_ref = entities[id])[message].apply(_ref, args);
      }
    };
  };
};

entities = {};

seed = 0;

module.exports = {
  generateID: generateID,
  register: register,
  removeFromRegistrar: removeFromRegistrar,
  transmit: transmit
};



},{}],18:[function(_dereq_,module,exports){
var anyPostponedArgs, anyPostponement, applyFnToCytolysedArgs, attempt, blockTillReady, block_N, block_N_Config, configReschedule, createCell, cytolyseAll, doAsync, endocytate, getEndocytateConfig, ignoreIrrelevant, isCell, isProperty, isRelevant, noOp, none, postpone, sampleProperties, writePostpone, _ref, _ref1,
  __slice = [].slice;

anyPostponement = _dereq_('./postponement-utilities').anyPostponement;

configReschedule = _dereq_('./configure-rescheduling').configReschedule;

_ref = _dereq_('./cell-utilities'), createCell = _ref.createCell, cytolyseAll = _ref.cytolyseAll, isCell = _ref.isCell;

isProperty = _dereq_('./dispatcher-comparisons').isProperty;

isRelevant = _dereq_('./constant-comparisons').isRelevant;

_ref1 = _dereq_('./constants'), none = _ref1.none, postpone = _ref1.postpone;

noOp = _dereq_('./utilities').noOp;

writePostpone = _dereq_('./postponement-utilities').writePostpone;

anyPostponedArgs = function(_arg) {
  var args, _;
  _ = _arg[0], args = _arg[1];
  return anyPostponement(args);
};

applyFnToCytolysedArgs = function(fn, args) {
  return fn.apply(null, cytolyseAll(args));
};

block_N = function() {
  var N, args, fn;
  N = arguments[0], fn = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  return configReschedule(block_N_Config, N, fn, args);
};

blockTillReady = function(fn) {
  return function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return block_N.apply(null, [10, fn].concat(__slice.call(args)));
  };
};

doAsync = function(fn) {
  return function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return endocytate(10, ignoreIrrelevant(fn), sampleProperties(args), createCell());
  };
};

endocytate = function(N, fn, managedArgs, cell) {
  var config;
  config = getEndocytateConfig(fn);
  return configReschedule(config, N, cell, managedArgs);
};

getEndocytateConfig = function(fn) {
  return {
    onRelease: function(cell, args) {
      return cell.write(applyFnToCytolysedArgs(fn, args));
    },
    onReschedule: writePostpone,
    shouldReschedule: anyPostponedArgs
  };
};

ignoreIrrelevant = function(fn) {
  return function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.every(isRelevant)) {
      return fn.apply(null, args);
    } else {
      return none;
    }
  };
};

sampleProperties = function(args) {
  return args.map(function(val) {
    if (isProperty(val)) {
      return val.sample();
    } else {
      return val;
    }
  });
};

attempt = block_N.bind(null, 10);

block_N_Config = {
  onRelease: applyFnToCytolysedArgs,
  shouldReschedule: anyPostponedArgs
};

module.exports = {
  attempt: attempt,
  blockTillReady: blockTillReady,
  doAsync: doAsync
};



},{"./cell-utilities":1,"./configure-rescheduling":2,"./constant-comparisons":4,"./constants":6,"./dispatcher-comparisons":10,"./postponement-utilities":16,"./utilities":23}],19:[function(_dereq_,module,exports){
var fromArray, fromCallback, fromDelayedValue, fromDispatcher, fromEventTarget, fromFinitePeriodicSequence, fromInternalDispatchOnly, fromMerger, fromPoll, fromSourceFunction, generateID, register, returnNoOp, _ref, _ref1;

_ref = _dereq_('./registrations'), generateID = _ref.generateID, register = _ref.register;

returnNoOp = _dereq_('./utilities').returnNoOp;

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

module.exports = (_ref1 = _dereq_('./source-determiners'), fromArray = _ref1.fromArray, fromCallback = _ref1.fromCallback, fromDelayedValue = _ref1.fromDelayedValue, fromDispatcher = _ref1.fromDispatcher, fromEventTarget = _ref1.fromEventTarget, fromFinitePeriodicSequence = _ref1.fromFinitePeriodicSequence, fromInternalDispatchOnly = _ref1.fromInternalDispatchOnly, fromMerger = _ref1.fromMerger, fromPoll = _ref1.fromPoll, fromSourceFunction = _ref1.fromSourceFunction, _ref1);



},{"./registrations":17,"./source-determiners":19,"./utilities":23}],20:[function(_dereq_,module,exports){
var filteringNonterminal, onFirstAndOnlyValue, onValue, permittingOnlyOneValue, transubscribe, _ref;

_ref = _dereq_('./transforms'), filteringNonterminal = _ref.filteringNonterminal, permittingOnlyOneValue = _ref.permittingOnlyOneValue;

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



},{"./transforms":22}],21:[function(_dereq_,module,exports){
var bind, bindBeforeTransmersal, bindIdentification, cytolyse, doAsync, end, functionize, getComponent, isArray, isCell, isEnd, isFunction, isKeypath, isPostponed, sinkIfSinkable, terminate, _ref, _ref1,
  __slice = [].slice;

_ref = _dereq_('./utilities'), bind = _ref.bind, getComponent = _ref.getComponent, isArray = _ref.isArray, isFunction = _ref.isFunction, isKeypath = _ref.isKeypath;

_ref1 = _dereq_('./scheduling'), cytolyse = _ref1.cytolyse, doAsync = _ref1.doAsync;

end = _dereq_('./constants').end;

isCell = _dereq_('./cell-utilities').isCell;

isEnd = _dereq_('./constant-comparisons').isEnd;

isPostponed = _dereq_('./postponement-utilities').isPostponed;

bindBeforeTransmersal = function(transmerse) {
  return function(fn) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return transmerse(bind(doAsync(fn)).apply(null, args));
    };
  };
};

bindIdentification = function(sink, sourceID, sid) {
  return function(val) {
    return sink(val, sourceID, sid);
  };
};

functionize = function(arg, args) {
  var msg;
  switch (false) {
    case !isFunction(arg):
      if (isArray(args)) {
        return bind(arg).apply(null, args);
      } else {
        return arg;
      }
      break;
    case !isKeypath(arg):
      return function(val) {
        var component;
        component = getComponent(arg, val);
        if (isFunction(component)) {
          return component.apply(null, args);
        } else {
          return component;
        }
      };
    case !isCell(arg):
      if (isPostponed(arg)) {
        msg = "The function 'functionize' cannot manage suspended cells.";
        throw new Error(msg);
      } else {
        return function() {
          return cytolyse(arg);
        };
      }
      break;
    default:
      return function() {
        return arg;
      };
  }
};

sinkIfSinkable = function(sink) {
  return function(value, isSinkable) {
    if (isSinkable) {
      return sink(value);
    }
  };
};

terminate = function(sink) {
  return sink(end);
};

module.exports = {
  bindBeforeTransmersal: bindBeforeTransmersal,
  bindIdentification: bindIdentification,
  functionize: functionize,
  sinkIfSinkable: sinkIfSinkable,
  terminate: terminate
};



},{"./cell-utilities":1,"./constant-comparisons":4,"./constants":6,"./postponement-utilities":16,"./scheduling":18,"./utilities":23}],22:[function(_dereq_,module,exports){
var attempt, bfiltering, bfilteringNonterminal, bindBeforeTransmersal, bindIdentification, blockTillReady, blocking, bmapping, delaying, doAsync, filtering, filteringDefined, filteringNonterminal, flattening, functionize, isDefined, isEnd, isNonTerminal, isRelevant, mapping, mappingEnd, monitoringFirst, monitoringLatest, negating, noOp, permittingOnlyOneValue, reducing, scanning, sinkIfSinkable, staggering, stateMachineProcessing, taking, _ref, _ref1, _ref2, _ref3, _ref4,
  __slice = [].slice;

_ref = _dereq_('./scheduling'), attempt = _ref.attempt, blockTillReady = _ref.blockTillReady, doAsync = _ref.doAsync;

_ref1 = _dereq_('./utilities'), isDefined = _ref1.isDefined, noOp = _ref1.noOp;

_ref2 = _dereq_('./constant-comparisons'), isEnd = _ref2.isEnd, isNonTerminal = _ref2.isNonTerminal, isRelevant = _ref2.isRelevant;

_ref3 = _dereq_('./transform-utilities'), bindBeforeTransmersal = _ref3.bindBeforeTransmersal, bindIdentification = _ref3.bindIdentification, functionize = _ref3.functionize, sinkIfSinkable = _ref3.sinkIfSinkable;

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



},{"./constant-comparisons":4,"./scheduling":18,"./transform-utilities":21,"./utilities":23}],23:[function(_dereq_,module,exports){
var FuncProto, ObjProto, bind, callOnlyOnce, compositeRegex, eachProperty, extend, extendProto, getComponent, getPrototypeOf, getType, identity, isArray, isAtomicKeypath, isDefined, isEmpty, isFromType, isFunction, isHash, isKeypath, isObject, keypathRegex, nativeBind, nativeToString, noOp, processKeypath, processRegex, returnNoOp, shallowCopy,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

bind = function(fn) {
  return function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return nativeBind.apply(fn, [null].concat(args));
  };
};

callOnlyOnce = function(fn) {
  var fnProxy;
  fnProxy = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    fnProxy = noOp;
    return fn.apply(null, args);
  };
  return function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return fnProxy.apply(null, args);
  };
};

eachProperty = function(fn, obj) {
  var key, val, _results;
  _results = [];
  for (key in obj) {
    if (!__hasProp.call(obj, key)) continue;
    val = obj[key];
    _results.push(fn(val, key));
  }
  return _results;
};

extend = function() {
  var key, mixin, mixins, obj, val, _i, _len;
  obj = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  for (_i = 0, _len = mixins.length; _i < _len; _i++) {
    mixin = mixins[_i];
    for (key in mixin) {
      if (!__hasProp.call(mixin, key)) continue;
      val = mixin[key];
      obj[key] = val;
    }
  }
  return obj;
};

extendProto = function() {
  var clone, mixins, prototype;
  prototype = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  clone = Object.create(prototype);
  return extend.apply(null, [clone].concat(__slice.call(mixins)));
};

getComponent = function(keypath, obj) {
  var key, nextKey, nextKeypath, _ref;
  if (isAtomicKeypath(keypath)) {
    key = keypath.slice(1);
    return shallowCopy(obj[key]);
  } else {
    _ref = processKeypath(keypath), nextKey = _ref[0], nextKeypath = _ref[1];
    if (!isHash(obj[nextKey])) {
      return null;
    }
    return getComponent(nextKeypath, obj[nextKey]);
  }
};

getType = function(val) {
  if (isObject(val)) {
    return getPrototypeOf(val);
  } else {
    return nativeToString.call(val);
  }
};

identity = function(val) {
  return val;
};

isArray = function(val) {
  return val instanceof Array;
};

isAtomicKeypath = function(keypath) {
  return !compositeRegex.test(keypath);
};

isDefined = function(val) {
  return val != null;
};

isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
};

isFromType = function(type) {
  return function(val) {
    var t;
    t = getType(val);
    switch (false) {
      case !(t === type):
        return true;
      case !!(isHash(t)):
        return false;
      case !(t === ObjProto):
        return false;
      default:
        return isFromType(type)(t);
    }
  };
};

isFunction = function(val) {
  return typeof val === 'function';
};

isHash = function(val) {
  return nativeToString.call(val) === '[object Object]';
};

isKeypath = function(val) {
  return keypathRegex.test(val);
};

isObject = function(val) {
  return val === Object(val);
};

noOp = (function() {});

processKeypath = function(keypath) {
  return processRegex.exec(keypath).slice(1, 3);
};

returnNoOp = function() {
  return noOp;
};

shallowCopy = function(val) {
  var copy, key, prop;
  switch (false) {
    case !isObject(val):
      copy = {};
      for (key in val) {
        if (!__hasProp.call(val, key)) continue;
        prop = val[key];
        copy[key] = prop;
      }
      return copy;
    case !isArray(val):
      return val.map(identity);
    default:
      return val;
  }
};

FuncProto = Function.prototype;

ObjProto = Object.prototype;

getPrototypeOf = Object.getPrototypeOf;

nativeBind = FuncProto.bind;

nativeToString = ObjProto.toString;

compositeRegex = /\.[^\.]*\./;

keypathRegex = /(\.([^\W]|\$)+)+$/;

processRegex = /\.([^\.]*)(\.?.*)$/;

module.exports = {
  bind: bind,
  callOnlyOnce: callOnlyOnce,
  eachProperty: eachProperty,
  extend: extend,
  extendProto: extendProto,
  getType: getType,
  getPrototypeOf: getPrototypeOf,
  identity: identity,
  isArray: isArray,
  isDefined: isDefined,
  isEmpty: isEmpty,
  isFromType: isFromType,
  isFunction: isFunction,
  isHash: isHash,
  isKeypath: isKeypath,
  isObject: isObject,
  nativeBind: nativeBind,
  noOp: noOp,
  returnNoOp: returnNoOp
};



},{}]},{},[13])
(13)
});
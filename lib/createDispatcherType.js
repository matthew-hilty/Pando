var CoreDispatcher, anyPostponement, callOnlyOnce, configReschedule, createDispatcherType, cytolyse, disconnectFrom, eachProperty, extendProto, generateID, identity, isEnd, isInitiatingDagUpdate, noOp, parseOpts, register, removeFromRegistrar, resetDagUpdateProcess, returnNoOp, transmit, _ref, _ref1, _ref2;

_ref = require('./dag-status'), isInitiatingDagUpdate = _ref.isInitiatingDagUpdate, resetDagUpdateProcess = _ref.resetDagUpdateProcess;

_ref1 = require('./utilities'), callOnlyOnce = _ref1.callOnlyOnce, eachProperty = _ref1.eachProperty, extendProto = _ref1.extendProto, identity = _ref1.identity, noOp = _ref1.noOp, returnNoOp = _ref1.returnNoOp;

_ref2 = require('./registrations'), generateID = _ref2.generateID, register = _ref2.register, removeFromRegistrar = _ref2.removeFromRegistrar, transmit = _ref2.transmit;

anyPostponement = require('./postponement-utilities').anyPostponement;

configReschedule = require('./configure-rescheduling').configReschedule;

CoreDispatcher = require('./core-types').CoreDispatcher;

cytolyse = require('./cell-utilities').cytolyse;

isEnd = require('./constant-comparisons').isEnd;

parseOpts = require('./parseOpts');

createDispatcherType = function(opts) {
  return function(source) {
    var activate, addSubscriber, alias, dispatch, dispatch_N, distribute, getAlias, id, informSubscribers, mixins, properties, proto, releaseFromRescheduling, reschedulingConfig, setAlias, sinks, stopSourceInflux, subscribe, terminate, terminated_question_, transact, transformDispatch, transformSubscribe, unsubscribe, _dispatch, _ref3, _subscribe;
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
    getAlias = function() {
      return alias;
    };
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
          return sink(value, id, sink.id);
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
        return disconnectFrom(sourceID, sid, id);
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
          return disconnectFrom(sourceID, sid, id);
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
      dispatch: dispatch,
      getAlias: getAlias,
      id: id,
      setAlias: setAlias,
      subscribe: subscribe,
      terminate: terminate,
      unsubscribe: unsubscribe
    };
    return register(extendProto(proto, properties, mixins));
  };
};

disconnectFrom = function(sourceID, sid, id) {
  var subscriptionID;
  subscriptionID = sid != null ? sid : id;
  if (sourceID) {
    return transmit(sourceID, 'unsubscribe', subscriptionID);
  }
};

module.exports = createDispatcherType;

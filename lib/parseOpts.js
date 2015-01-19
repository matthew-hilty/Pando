var CoreDispatcher, identity, isFunction, parseOpts, _ref;

CoreDispatcher = require('./core-types').CoreDispatcher;

_ref = require('./utilities'), identity = _ref.identity, isFunction = _ref.isFunction;

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

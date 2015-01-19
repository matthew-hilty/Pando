var bind, bindBeforeTransmersal, bindIdentification, cytolyse, doAsync, end, functionize, getComponent, isArray, isCell, isEnd, isFunction, isKeypath, isPostponed, sinkIfSinkable, terminate, _ref, _ref1,
  __slice = [].slice;

_ref = require('./utilities'), bind = _ref.bind, getComponent = _ref.getComponent, isArray = _ref.isArray, isFunction = _ref.isFunction, isKeypath = _ref.isKeypath;

_ref1 = require('./scheduling'), cytolyse = _ref1.cytolyse, doAsync = _ref1.doAsync;

end = require('./constants').end;

isCell = require('./cell-utilities').isCell;

isEnd = require('./constant-comparisons').isEnd;

isPostponed = require('./postponement-utilities').isPostponed;

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

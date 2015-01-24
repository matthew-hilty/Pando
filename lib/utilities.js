var FuncProto, ObjProto, bind, callOnlyOnce, compose, compositeRegex, eachProperty, extend, extendProto, getComponent, getPrototypeOf, getType, identity, isArray, isAtomicKeypath, isDefined, isEmpty, isFromType, isFunction, isHash, isKeypath, isObject, keypathRegex, nativeBind, nativeToString, noOp, processKeypath, processRegex, returnNoOp, shallowCopy,
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

compose = function(fns) {
  return fns.reduceRight(function(composedFn, fn) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return fn(composedFn.apply(null, args));
    };
  });
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
  compose: compose,
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

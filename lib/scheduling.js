var anyPostponedArgs, anyPostponement, applyFnToCytolysedArgs, attempt, blockTillReady, block_N, block_N_Config, configReschedule, createCell, cytolyseAll, doAsync, endocytate, getEndocytateConfig, ignoreIrrelevant, isCell, isProperty, isRelevant, noOp, none, postpone, sampleProperties, writePostpone, _ref, _ref1,
  __slice = [].slice;

anyPostponement = require('./postponement-utilities').anyPostponement;

configReschedule = require('./configure-rescheduling').configReschedule;

_ref = require('./cell-utilities'), createCell = _ref.createCell, cytolyseAll = _ref.cytolyseAll, isCell = _ref.isCell;

isProperty = require('./dispatcher-comparisons').isProperty;

isRelevant = require('./constant-comparisons').isRelevant;

_ref1 = require('./constants'), none = _ref1.none, postpone = _ref1.postpone;

noOp = require('./utilities').noOp;

writePostpone = require('./postponement-utilities').writePostpone;

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

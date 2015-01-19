var anyPostponedArgs, anyPostponement, configReschedule, defaultConfig, extend, noOp, parseConfig, reschedule, _ref, _ref1,
  __slice = [].slice;

_ref = require('./postponement-utilities'), anyPostponedArgs = _ref.anyPostponedArgs, anyPostponement = _ref.anyPostponement;

_ref1 = require('./utilities'), extend = _ref1.extend, noOp = _ref1.noOp;

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

var EventStream, Property, configReschedule, createCell, extend, genESOpts, genNonInitPropOpts, genPropOpts, getSampleConfig, isDagUpdating, isEnd, isRelevant, noOp, none, parseOpts, postpone, writePostpone, _ref, _ref1, _ref2, _ref3;

configReschedule = require('./configure-rescheduling').configReschedule;

createCell = require('./cell-utilities').createCell;

_ref = require('./dispatcher-types'), EventStream = _ref.EventStream, Property = _ref.Property;

_ref1 = require('./utilities'), extend = _ref1.extend, noOp = _ref1.noOp;

isDagUpdating = require('./dag-status').isDagUpdating;

_ref2 = require('./constant-comparisons'), isEnd = _ref2.isEnd, isRelevant = _ref2.isRelevant;

_ref3 = require('./constants'), none = _ref3.none, postpone = _ref3.postpone;

parseOpts = require('./parseOpts');

writePostpone = require('./postponement-utilities').writePostpone;

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

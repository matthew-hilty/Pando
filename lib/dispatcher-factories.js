var createDispatcherType, createEventStream, createEventStreamBus, createNonInitProperty, createNonInitPropertyBus, createProperty, createPropertyBus, fromInternalDispatchOnly, genESOpts, genNonInitPropOpts, genPropOpts, _ref;

createDispatcherType = require('./createDispatcherType');

fromInternalDispatchOnly = require('./source-determiners').fromInternalDispatchOnly;

_ref = require('./options-generators'), genESOpts = _ref.genESOpts, genNonInitPropOpts = _ref.genNonInitPropOpts, genPropOpts = _ref.genPropOpts;

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

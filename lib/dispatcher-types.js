var CoreDispatcher, EventStream, Property, displayDispatcherType, extendCoreDispatcher, extendProto, _ref;

_ref = require('./core-types'), CoreDispatcher = _ref.CoreDispatcher, displayDispatcherType = _ref.displayDispatcherType;

extendProto = require('./utilities').extendProto;

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

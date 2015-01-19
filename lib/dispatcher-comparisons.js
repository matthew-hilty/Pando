var CoreDispatcher, EventStream, Property, isFromType, _ref;

CoreDispatcher = require('./core-types').CoreDispatcher;

_ref = require('./dispatcher-types'), EventStream = _ref.EventStream, Property = _ref.Property;

isFromType = require('./utilities').isFromType;

module.exports = {
  isDispatcher: isFromType(CoreDispatcher),
  isEventStream: isFromType(EventStream),
  isProperty: isFromType(Property)
};

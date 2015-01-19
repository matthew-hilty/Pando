var CoreCell, CoreDispatcher, bracket, createSuperType, display, displayCellType, displayDispatcherType, extendProto, isFromType, _ref;

bracket = require('./constant-utilities').bracket;

_ref = require('./utilities'), extendProto = _ref.extendProto, isFromType = _ref.isFromType;

display = function(supertype) {
  return function(subtype) {
    return function() {
      return bracket("" + supertype + ": " + subtype);
    };
  };
};

createSuperType = function(display, typeLabel) {
  return {
    inspect: display('Core'),
    supertype: typeLabel,
    type: typeLabel
  };
};

displayCellType = display('Cell');

displayDispatcherType = display('Dispatcher');

CoreCell = createSuperType(displayCellType, 'core-cell');

CoreDispatcher = createSuperType(displayDispatcherType, 'core-dispatcher');

module.exports = {
  CoreCell: CoreCell,
  CoreDispatcher: CoreDispatcher,
  displayDispatcherType: displayDispatcherType
};

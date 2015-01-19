var CoreCell, createCell, cytolyse, cytolyseAll, extendProto, getType, isCell, _ref;

CoreCell = require('./core-types').CoreCell;

_ref = require('./utilities'), extendProto = _ref.extendProto, getType = _ref.getType;

createCell = function(initialValue) {
  var read, value, write;
  value = initialValue != null ? initialValue : null;
  read = function() {
    return value;
  };
  write = function(_value) {
    return value = _value;
  };
  return extendProto(CoreCell, {
    read: read,
    write: write
  });
};

isCell = function(val) {
  return getType(val) === CoreCell;
};

cytolyse = function(val) {
  if (isCell(val)) {
    return cytolyse(val.read());
  } else {
    return val;
  }
};

cytolyseAll = function(args) {
  return args.map(cytolyse);
};

module.exports = {
  createCell: createCell,
  cytolyse: cytolyse,
  cytolyseAll: cytolyseAll,
  isCell: isCell
};

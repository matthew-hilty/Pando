var entities, generateID, register, removeFromRegistrar, seed, transmit,
  __slice = [].slice;

generateID = function() {
  return seed++;
};

register = function(entity) {
  entities[entity.id] = entity;
  return entity;
};

removeFromRegistrar = function(id) {
  return delete entities[id];
};

transmit = function() {
  var args, id, message, _ref;
  id = arguments[0], message = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  if (entities[id]) {
    return (_ref = entities[id])[message].apply(_ref, args);
  }
};

entities = {};

seed = 0;

module.exports = {
  generateID: generateID,
  register: register,
  removeFromRegistrar: removeFromRegistrar,
  transmit: transmit
};

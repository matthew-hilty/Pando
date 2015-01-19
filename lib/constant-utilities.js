var bracket, createSingleton;

bracket = function(label) {
  return '<' + label + '>';
};

createSingleton = function(label) {
  return {
    inspect: function() {
      return bracket(label);
    }
  };
};

module.exports = {
  bracket: bracket,
  createSingleton: createSingleton
};

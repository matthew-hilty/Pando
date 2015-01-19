var isDagUpdating, isInitiatingDagUpdate, isInitiatingUpdate, isUpdating, resetDagUpdateProcess;

isInitiatingUpdate = true;

isUpdating = false;

isDagUpdating = function() {
  return isUpdating;
};

isInitiatingDagUpdate = function() {
  var _isInitiatingUpdate;
  _isInitiatingUpdate = isInitiatingUpdate;
  isInitiatingUpdate = false;
  isUpdating = true;
  return _isInitiatingUpdate;
};

resetDagUpdateProcess = function() {
  isUpdating = false;
  return isInitiatingUpdate = true;
};

module.exports = {
  isDagUpdating: isDagUpdating,
  isInitiatingDagUpdate: isInitiatingDagUpdate,
  resetDagUpdateProcess: resetDagUpdateProcess
};

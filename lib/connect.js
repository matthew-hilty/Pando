var connect, generateID;

generateID = require('./registrations').generateID;

connect = function(src, tgt, transform) {
  var dispatch, newSink, subscription;
  dispatch = tgt.dispatch;
  if (transform == null) {
    transform = identity;
  }
  newSink = transform(dispatch);
  if (newSink === dispatch) {
    return src.subscribe(newSink);
  }
  subscription = function(value, sourceID) {
    return newSink(value, sourceID, subscription.id);
  };
  subscription.id = generateID();
  return src.subscribe(subscription);
};

module.exports = connect;

var EmitterStoreFn = function EmitterStoreFn() {};

EmitterStoreFn.prototype.update = function (store) {
  var i = store.length - 1;
  for (; i >= 0; i--) {
    store[i].updateEmitter();
    // store[i].renderEmitter( ctx );
  }
};

module.exports.EmitterStoreFn = EmitterStoreFn;
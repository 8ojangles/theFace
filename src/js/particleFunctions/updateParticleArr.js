var particleFn = require('./../particleFn.js').particleFn;

var updateParticleArr = function updateParticleArr(context, storeArr, poolArr, animation, canvasConfig, entityCounter, emitterStore) {
    // loop housekeeping
    var arr = storeArr;
    var arrLen = arr.length - 1;
    for (var i = arrLen; i >= 0; i--) {
        var p = arr[i];
        p.isAlive != 0 ? particleFn.checkParticleKillConditions(p, canvasConfig.width, canvasConfig.height) ? p.kill(poolArr, p.idx, entityCounter) : p.update(emitterStore) : false;
    } // end For loop
    // liveEntityCount === 0 ? ( console.log( 'liveEntityCount === 0 stop anim' ), animation.state = false ) : 0;
};

module.exports.updateParticleArr = updateParticleArr;
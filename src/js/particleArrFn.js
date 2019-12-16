var renderParticleArr = require('./particleFunctions/renderParticleArr.js').renderParticleArr;
var updateParticleArr = require('./particleFunctions/updateParticleArr.js').updateParticleArr;

var particleArrFn = {

	renderParticleArr: renderParticleArr,
	updateParticleArr: updateParticleArr

};

module.exports.particleArrFn = particleArrFn;
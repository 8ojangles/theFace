var checkParticleKillConditions = require('./particleFunctions/checkParticleKillConditions.js').checkParticleKillConditions;
var createPerParticleAttributes = require('./particleFunctions/createPerParticleAttributes.js').createPerParticleAttributes;
var updateParticle = require('./particleFunctions/updateParticle.js').updateParticle;
var killParticle = require('./particleFunctions/killParticle.js').killParticle;

var particleFn = {

	checkParticleKillConditions: checkParticleKillConditions,
	createPerParticleAttributes: createPerParticleAttributes,
	updateParticle: updateParticle,
	killParticle: killParticle

};

module.exports.particleFn = particleFn;
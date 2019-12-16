var trig = require('./../trigonomicUtils.js').trigonomicUtils;
var mathUtils = require('./../mathUtils.js').mathUtils;
var getValue = require('./../utilities.js').getValue;

var createPerParticleAttributes = function createPerParticleAttributes(x, y, emissionOpts, perParticleOpts) {
    // let themed = perParticleOpts.theme || themes.reset;

    var themed = perParticleOpts || themes.reset;
    var emitThemed = emissionOpts || false;
    var life = mathUtils.randomInteger(themed.life.min, themed.life.max);
    // use bitwise to check for odd/even life vals. Make even to help with anims that are fraction of life (frames)
    life & 1 ? life++ : false;

    var emission = emitThemed.emission || emitThemed;

    var direction = emission.direction.rad > 0 ? emission.direction.rad : mathUtils.getRandomArbitrary(emission.direction.min, emission.direction.max) * Math.PI;

    // set new particle origin dependant on the radial displacement
    if (emission.radialDisplacement > 0) {
        var newCoords = trig.radialDistribution(x, y, emission.radialDisplacement + mathUtils.random(emission.radialDisplacementOffset * -1, emission.radialDisplacementOffset), direction);

        x = newCoords.x;
        y = newCoords.y;
    }

    var impulse = emission.impulse.pow > 0 ? emission.impulse.pow : mathUtils.random(emission.impulse.min, emission.impulse.max);

    var initR = mathUtils.random(themed.radius.min, themed.radius.max);
    var targetRadius = mathUtils.random(themed.targetRadius.min, themed.targetRadius.max);
    var acceleration = mathUtils.random(themed.velAcceleration.min, themed.velAcceleration.max);
    var velocities = trig.calculateVelocities(x, y, direction, impulse);

    var initColor = themed.colorProfiles[0];
    var color4Data = {
        r: initColor.r,
        g: initColor.g,
        b: initColor.b,
        a: initColor.a
    };

    var willFlare = void 0;
    var willFlareTemp = mathUtils.randomInteger(0, 1000);

    var tempCustom = {
        lensFlare: {
            mightFlare: true,
            willFlare: themed.customAttributes.lensFlare.mightFlare === true && willFlareTemp < 10 ? true : false,
            angle: 0.30
        }

        // let customAttributes = themed.customAttributes;


    };

    var ppa = {
        active: perParticleOpts.active || themed.active || 0,
        initR: initR,
        tR: targetRadius,
        lifeSpan: life,
        angle: direction,
        magnitude: impulse,
        relativeMagnitude: impulse,
        magnitudeDecay: themed.magDecay,
        x: x,
        y: y,
        xVel: velocities.xVel,
        yVel: velocities.yVel,
        vAcc: acceleration,
        applyForces: themed.applyGlobalForces,
        color4Data: {
            r: color4Data.r, g: color4Data.g, b: color4Data.b, a: color4Data.a
        },
        colorProfiles: themed.colorProfiles,

        // color4Change: color4Change,
        killConditions: themed.killConditions,
        customAttributes: tempCustom,
        // renderFN: themed.renderParticle || renderParticle,
        renderFN: themed.renderParticle,
        events: themed.events
    };
    
    // console.log( 'color4DataEnd: ', color4DataEnd );
    var animArr = [];
    var particleAnimTrackArr = themed.animationTracks;
    var splChrs = '.';
    // console.log( 'themed.animationTracks: ', themed.animationTracks );
    if (particleAnimTrackArr && particleAnimTrackArr.length) {
        var particleAnimTrackArrLen = particleAnimTrackArr.length;
        for (var i = particleAnimTrackArrLen - 1; i >= 0; i--) {

            var t = particleAnimTrackArr[i];
            // console.log( 't: ', t );

            var prm = t.param.split(splChrs);
            var prmTemp = { path: prm, pathLen: prm.length };

            var baseVal = getValue(t.baseAmount, ppa);

            var targetVal = void 0;
            if (t.targetValuePath) {

                if (getValue(t.targetValuePath, ppa) === 0) {
                    targetVal = baseVal * -1;
                } else {
                    targetVal = getValue(t.targetValuePath, ppa) - baseVal;
                }
            } else if (t.targetAmount) {
                targetVal = t.targetAmount;
            }

            var duration = void 0;
            t.duration === 'life' ? duration = life : t.duration < 1 ? duration = life * t.duration : t.duration > 1 ? duration = life : false;

            animArr.push({ animName: t.animName, active: t.active, param: prmTemp, baseAmount: baseVal, targetAmount: targetVal, duration: duration, easing: t.easing, linkedAnim: t.linkedAnim, linkedEvent: t.linkedEvent });
        }
    }

    ppa.animationTracks = animArr;

    return ppa;
};

module.exports.createPerParticleAttributes = createPerParticleAttributes;
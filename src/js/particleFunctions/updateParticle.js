var easing = require('./../easing.js').easingEquations;
var environment = require('./../environment.js').environment;
var physics = environment.forces;

var updateParticle = function updateParticle(emitterArr) {
    var p = this;
    var totalLifeTicks = p.lifeSpan;

    // position
    // p.x += p.xVel * p.magnitudeDecay;
    // p.y += p.yVel * p.magnitudeDecay;
    p.x += p.xVel;
    p.y += p.yVel;

    p.xVel *= p.vAcc;
    p.yVel *= p.vAcc;

    // p.yVel += physics.gravity;
    // p.xVel += physics.wind;
    // p.relativeMagnitude *= p.magnitudeDecay;

    p.relativeMagnitude *= p.vAcc * 1.005;

    if (p.applyForces) {
        p.yVel += physics.gravity;
    }
    // speed
    // p.magnitudeDecay > 0 ? p.magnitudeDecay -= physics.friction : p.magnitudeDecay = 0;

    // p.magnitudeDecay += (p.vAcc * 0.00025);
    // p.magnitudeDecay = deccelerateMagnitude( p );
    // p.magnitudeDecay = accelerateMagnitude( p );

    // life
    p.currLifeInv = totalLifeTicks - p.currLife;
    var currLifeTick = p.currLifeInv;
    // size (radius for circle)


    var animTracks = p.animationTracks;
    var animTracksLen = animTracks.length;

    for (var i = animTracksLen - 1; i >= 0; i--) {
        // console.log( 'i', i );
        var t = animTracks[i];

        if (t.active === true) {

            var paramPath = t.param.path,
                paramLen = t.param.pathLen;

            paramLen === 1 ? p[paramPath[0]] = easing[t.easing](currLifeTick, t.baseAmount, t.targetAmount, t.duration) : paramLen === 2 ? p[paramPath[0]][paramPath[1]] = easing[t.easing](currLifeTick, t.baseAmount, t.targetAmount, t.duration) : paramLen === 3 ? p[paramPath[0]][paramPath[1]][paramPath[2]] = easing[t.easing](currLifeTick, t.baseAmount, t.targetAmount, t.duration) : false;

            if (currLifeTick === t.duration) {
                t.active = false;

                if (t.linkedEvent !== false && typeof t.linkedEvent !== 'undefined') {

                    var particleEvents = p.events;

                    for (var j = particleEvents.length - 1; j >= 0; j--) {

                        var thisParticleEvent = p.events[ j ];
                        if (thisParticleEvent.eventType = t.linkedEvent) {
                            if (t.linkedEvent === 'emit') {

                                var thisParticleEventParams = thisParticleEvent.eventParams;

                                if (typeof thisParticleEventParams.emitter !== 'undefined') {
                                    thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
                                } else {
                                    for (var k = emitterArr.length - 1; k >= 0; k--) {
                                        if (emitterArr[ k ].name === thisParticleEventParams.emitterName) {
                                            thisParticleEventParams.emitter = emitterArr[ k ];
                                            thisParticleEventParams.emitter.triggerEmitter({ x: p.x, y: p.y });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (p.idx == 9987) {
                    // console.warn( 'flipping anim' );
                }

                if (t.linkedAnim !== false) {

                    for (var l = animTracksLen - 1; l >= 0; l--) {
                        if (animTracks[ l ].animName === t.linkedAnim) {
                            animTracks[ l ].active = true;
                        }
                    }
                }
            }
        }
    }

    if (p.idx == 9987) {}
    // console.log( 'thisParticleAlpha',  p.color4Data.a );


    // life taketh away
    p.currLife--;
};

module.exports.updateParticle = updateParticle;
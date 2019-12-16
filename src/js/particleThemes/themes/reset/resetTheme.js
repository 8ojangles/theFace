var mathUtils = require('./../../../mathUtils.js').mathUtils;

var resetTheme = {
    emmisionRate: { min: 0, max: 0 },
    contextBlendingMode: 'source-over',
    active: 0,
    life: { min: 0, max: 0 },
    angle: { min: 0, max: 0 },
    mag: { min: 0, max: 0 },
    magDecay: 0,
    // velAcceleration: 1, // 0 - 1 (i.e. 0.5) = decceleration, 1+ (i.e. 1.2) = acceleration
    velAcceleration: { min: 1, max: 1 },
    radius: { min: 0, max: 0 },
    targetRadius: { min: 0, max: 0 },
    shrinkRate: 0,
    radialDisplacement: 0,
    radialDisplacementOffset: 0,
    applyGlobalForces: false,
    colorProfiles: [{ r: 0, g: 0, b: 0, a: 0 }],
    renderProfiles: [{ shape: 'Circle', colorProfileIdx: 0 }],
    colorStart: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
    colorEnd: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 0.30
        }
    },
    colorAnimationConfig: {
        easing: {
            r: 'linearEase',
            g: 'linearEase',
            b: 'linearEase',
            a: 'linearEase'
        }
    },
    animationTracks: [],
    killConditions: {
        boundaryCheck: false,
        colorCheck: [],
        perAttribute: []
    },
    renderParticle: false
};

module.exports.resetTheme = resetTheme;
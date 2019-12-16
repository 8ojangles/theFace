var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;

var rgba = coloring.rgba;

var flameTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 30, max: 60 },
    angle: { min: 1.45, max: 1.55 },
    // mag: { min: 8, max: 13 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1, max: 1 },
    magDecay: 1.5,
    radius: { min: 100, max: 180 },
    targetRadius: { min: 1, max: 2 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 255, g: 255, b: 255, a: 0.5 }, { r: 255, g: 0, b: 0, a: 1 }],
    renderProfiles: [{ shapeFn: 'fillCircle', colorProfileIdx: 0 }],
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 0.30
        }
    },
    proximity: {
        check: false,
        threshold: 50
    },
    animationTracks: [{
        animName: 'radiusFade',
        active: true,
        param: 'r',
        baseAmount: 'initR',
        targetValuePath: 'tR',
        duration: 'life',
        easing: 'easeInExpo',
        linkedAnim: false
    }, {
        animName: 'color4DataChangeGreen',
        active: true,
        param: 'color4Data.g',
        baseAmount: 'colorProfiles[0].g',
        targetValuePath: 'colorProfiles[1].g',
        duration: 0.4,
        easing: 'easeInQuart',
        linkedAnim: false
    }, {
        animName: 'color4DataChangeBlue',
        active: true,
        param: 'color4Data.b',
        baseAmount: 'colorProfiles[0].b',
        targetValuePath: 'colorProfiles[1].b',
        duration: 0.5,
        easing: 'easeOutQuart',
        linkedAnim: false
    }, {
        animName: 'alphaDelay',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[0].a',
        duration: 0.5,
        easing: 'linearEase',
        linkedAnim: 'alphaFadeIn'
    }, {
        animName: 'alphaFadeIn',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[1].a',
        duration: 0.2,
        easing: 'easeInQuint',
        linkedAnim: 'alphaFadeOut'
    }, {
        animName: 'alphaFadeOut',
        active: false,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[1].a',
        targetValuePath: 'colorProfiles[0].a',
        duration: 0.3,
        easing: 'linearEase',
        linkedAnim: false,
        // linkedEvent: 'emit',
        linkedEvent: false

    }],

    events: [{
        eventType: 'emit',
        eventParams: {
            emitterName: 'smokeEmitter'
        }
    }],

    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 0,
        colorCheck: [],
        perAttribute: [{ name: 'radius', value: 0 }, { name: 'currLife', value: 0 }],
        linkedEvent: false
    },
    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;
        var stretchVal = mathUtils.map(p.currLifeInv, 0, p.lifeSpan, 1, 5);
        var offsetMap = mathUtils.map(p.currLifeInv, 0, p.lifeSpan, 0, 1);
        var newAngle = trig.getAngleAndDistance(x, y, x + p.xVel, y + p.yVel);
        if (context.globalCompositeOperation !== 'lighter') {
            context.globalCompositeOperation = 'lighter';
        }
        context.save();
        context.translate(x, y);
        // context.save();
        var alpha = colorData.a;
        if (alpha > 1) {
            alpha = 1;
        }
        var offset = r * offsetMap;
        // // var offset = 0;
        var grd = context.createRadialGradient(0, 0 + offset, 0, 0, 0 + offset, r);
        // var grd = context.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, rgba(colorData.r, colorData.g, colorData.b, 0.03 * alpha));
        grd.addColorStop(0.5, rgba(colorData.r, colorData.g, colorData.b, 0.06 * alpha));
        grd.addColorStop(0.7, rgba(colorData.r, colorData.g, colorData.b, 0.065 * alpha));
        grd.addColorStop(0.85, rgba(colorData.r, colorData.g, colorData.b, 0.015 * alpha));
        grd.addColorStop(1, rgba(colorData.r, colorData.g, colorData.b, 0));
        context.fillStyle = grd;

        context.rotate(newAngle.angle);
        context.fillEllipse(0, 0, r * stretchVal, r, context);
        context.restore();
    }
};

module.exports.flameTheme = flameTheme;
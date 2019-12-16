var mathUtils = require('./../../../mathUtils.js').mathUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

var smokeTheme = {
    contextBlendingMode: 'source-over',
    active: 1,
    life: { min: 400, max: 500 },
    angle: { min: 1.45, max: 1.55 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 0.999, max: 0.9999 },
    // magDecay: 1.5,
    radius: { min: 30, max: 50 },
    targetRadius: { min: 70, max: 130 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 100, g: 100, b: 100, a: 0 }, { r: 0, g: 0, b: 0, a: 0.05 }, { r: 100, g: 100, b: 100, a: 0 }],
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
        animName: 'radiusGrow',
        active: true,
        param: 'r',
        baseAmount: 'initR',
        targetValuePath: 'tR',
        duration: 'life',
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'alphaFadeIn',
        active: true,
        param: 'color4Data.a',
        baseAmount: 'colorProfiles[0].a',
        targetValuePath: 'colorProfiles[1].a',
        duration: 0.1,
        easing: 'easeOutQuint',
        linkedAnim: false
    }, {
        animName: 'red',
        active: true,
        param: 'color4Data.r',
        baseAmount: 'colorProfiles[0].r',
        targetValuePath: 'colorProfiles[1].r',
        duration: 0.2,
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'green',
        active: true,
        param: 'color4Data.g',
        baseAmount: 'colorProfiles[0].g',
        targetValuePath: 'colorProfiles[1].g',
        duration: 0.2,
        easing: 'linearEase',
        linkedAnim: false
    }, {
        animName: 'blue',
        active: true,
        param: 'color4Data.b',
        baseAmount: 'colorProfiles[0].b',
        targetValuePath: 'colorProfiles[1].b',
        duration: 0.2,
        easing: 'linearEase',
        linkedAnim: false
    }],
    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 200,
        colorCheck: [],
        perAttribute: false
    },
    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;
        // console.log( 'rendering smoke' );

        if (context.globalCompositeOperation !== 'source-over') {
            context.globalCompositeOperation = 'source-over';
        }

        var grd = context.createRadialGradient(x, y, 0, x, y, r);
        // var grd = context.createRadialGradient(x, y, 0, x, y, r);
        // grd.addColorStop(0, rgba( colorData.r,  colorData.g, colorData.b, 0.05) );
        // grd.addColorStop(1, rgba( colorData.r, colorData.g, colorData.b, 0) );
        grd.addColorStop(0, rgba(colorData.r, colorData.g, colorData.b, colorData.a));
        grd.addColorStop(1, rgba(colorData.r, colorData.g, colorData.b, 0));
        context.fillStyle = grd;
        context.fillCircle(x, y, r, context);
    }
};

module.exports.smokeTheme = smokeTheme;
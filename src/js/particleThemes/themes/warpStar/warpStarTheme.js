var mathUtils = require('./../../../mathUtils.js').mathUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;
var coloring = require('./../../../colorUtils.js').colorUtils;
var rgba = coloring.rgba;

var warpStarTheme = {
    contextBlendingMode: 'lighter',
    active: 1,
    life: { min: 50, max: 100 },
    angle: { min: 0, max: 2 },
    // velAcceleration: 1.05,
    velAcceleration: { min: 1.01, max: 1.2 },
    magDecay: 1,
    radius: { min: 1.2, max: 1.6 },
    targetRadius: { min: 2.2, max: 3 },
    applyGlobalForces: false,
    colorProfiles: [{ r: 255, g: 255, b: 255, a: 0 }, { r: 255, g: 255, b: 255, a: 1 }],
    renderProfiles: [{ shape: 'Circle', colorProfileIdx: 0 }, { shape: 'Circle', colorProfileIdx: 1 }, { shape: 'Circle', colorProfileIdx: 2 }],
    customAttributes: {
        lensFlare: {
            mightFlare: true,
            willFlare: false,
            angle: 1.50
        }
    },
    animationTracks: [
        {
            animName: 'radiusGrow',
            active: true,
            param: 'r',
            baseAmount: 'initR',
            targetValuePath: 'tR',
            duration: 'life',
            easing: 'linearEase',
            linkedAnim: false
        }, {
            animName: 'fadeIn',
            active: true,
            param: 'color4Data.a',
            baseAmount: 'colorProfiles[0].a',
            targetValuePath: 'colorProfiles[1].a',
            duration: 'life',
            easing: 'linearEase',
            linkedAnim: false
        }
    ],
    killConditions: {
        boundaryCheck: true,
        boundaryOffset: 400,
        colorCheck: [],
        perAttribute: []
    },
    renderParticle: function renderParticle(x, y, r, colorData, context) {
        var p = this;

        var stretchVal = mathUtils.map(p.relativeMagnitude, 0, 100, 1, 10);
        var chromeVal = mathUtils.map(stretchVal, 0, 10, 1, 4);
        var thisWillFlare = p.customAttributes.lensFlare.willFlare;

        context.translate(x, y);
        context.rotate(p.angle);

        if (chromeVal < 1) {
            context.fillStyle = "rgba( 255, 255, 255, 1 )";
            context.fillEllipse(0, 0, r * stretchVal, r, context);
        } else {
            // fake chromatic abberation ( rainbowing lens effect due to light refraction
            context.fillStyle = "rgba( 255, 0, 0, " + colorData.a + " )";
            context.fillEllipse(chromeVal * -1, 0, r * stretchVal, r, context);
            context.fillStyle = "rgba( 0, 255, 0, " + colorData.a + " )";
            context.fillEllipse(0, 0, r * stretchVal, r, context);
            context.fillStyle = "rgba( 0, 0, 255, " + colorData.a + " )";
            context.fillEllipse(0, chromeVal, r * stretchVal, r, context);
        }
        context.rotate(-p.angle);
        context.translate(-x, -y);

        if ( thisWillFlare ) {

            var flareAngle = trig.angle( x, y, 960, 469 );
            var flareCos = Math.cos( flareAngle );
            var flareSin = Math.sin( flareAngle );

            // var invertedFlareAngle = trig.angle(x, y, 960, 469);


            context.save();

                context.translate(x, y);

                // light glare horizontal
                var opacity1 = p.color4Data.a * 0.15;
                var shineRand = mathUtils.randomInteger(5, 10);
                var shineGrd = context.createRadialGradient(0, 0, 0, 0, 0, 800);
                shineGrd.addColorStop(0, "rgba( 255,255, 255, " + opacity1 + " )");
                shineGrd.addColorStop(1, "rgba( 255, 255, 255, 0 )");
                context.scale(shineRand * opacity1, 0.005);
                context.fillStyle = shineGrd;

                context.fillCircle(0, 0, 800, context);
                context.scale(0.005, shineRand);
                context.fillCircle(0, 0, 800, context);


                context.rotate( 1.5 );
                context.fillCircle(0, 0, 800, context);
                context.rotate( 1 );
                context.fillCircle(0, 0, 800, context);
                context.rotate( -0.5 );

            context.restore();


            // big flare
            var opacity2 = p.color4Data.a * 0.05;

            var grd = context.createRadialGradient(x, y, 0, x, y, 100);
            grd.addColorStop(0.75, "rgba( 255, 0, 0, 0 )");
            grd.addColorStop(0.8, "rgba( 255, 0, 0, " + opacity2 + " )");
            grd.addColorStop(0.85, "rgba( 0, 255, 0, " + opacity2 + " )");
            grd.addColorStop(0.9, "rgba( 0, 0, 255, " + opacity2 + " )");
            grd.addColorStop(1, "rgba( 0, 0, 255, 0 )");
            context.fillStyle = grd;
            context.fillCircle(x, y, 100, context);

            var radDist1 = 200 * stretchVal;
            var x2 = radDist1 * flareCos + x;
            var y2 = radDist1 * flareSin + y;
            var x2a = ( radDist1 * 1.5 ) * flareCos + x;
            var y2a = ( radDist1 * 1.5 ) * flareSin + y;

            var opacity3 = p.color4Data.a * 0.025;
            // little flare 1
            var grd2 = context.createRadialGradient(x2, y2, 0, x2, y2, 50);

            grd2.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2.addColorStop(1, "rgba( 255, 255, 255, 0 )");

            context.fillStyle = grd2;
            context.fillCircle(x2, y2, 50, context);

            // little flare 2
            var grd2a = context.createRadialGradient(x2a, y2a, 0, x2a, y2a, 50);

            grd2a.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2a.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd2a.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd2a;
            context.fillCircle(x2a, y2a, 50, context);

            var radDist2 = 300 * stretchVal * 1.5;
            var x3 = radDist2 * flareCos + x;
            var y3 = radDist2 * flareSin + y;
            var x3a = ( radDist2 * 1.5 ) * flareCos + x;
            var y3a = ( radDist2 * 1.5 ) * flareSin + y;

            // little flare 3
            var grd3 = context.createRadialGradient(x3, y3, 0, x3, y3, 25);

            grd3.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd3;
            context.fillCircle(x3, y3, 25, context);

            // little flare 4
            var grd3a = context.createRadialGradient(x3a, y3a, 0, x3a, y3a, 25);

            grd3a.addColorStop(0, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3a.addColorStop(0.8, "rgba( 255, 255, 255, " + opacity3 + " )");
            grd3a.addColorStop(1, "rgba( 255, 255, 255, 0 )");
            context.fillStyle = grd3a;
            context.fillCircle(x3a, y3a, 25, context);
        }
    }
};

module.exports.warpStarTheme = warpStarTheme;
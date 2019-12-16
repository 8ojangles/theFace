var twoPi = require('./trigonomicUtils.js').trigonomicUtils.twoPi;

var numRays = 24;
var raySize = 300;

var sunCorona = {
    numRays: numRays,
    numRaysDouble: numRays * 2,
    raySize: raySize,
    raySizeDiffMax: 100,
    raySpread: 0.025,
    phi: 0
}

sunCorona.render = function( x, y, sineWave, invSineWave, ctx ) {

    const wave = sineWave;
    const invWave = invSineWave;

    const numRays = this.numRaysDouble;
    const baseR = this.rayBaseRadius / 3;
    const raySize = this.raySize;
    const raySpread = this.raySpread;
    const rayDiff = this.raySizeDiffMax;

    // straight rays
    let calculateRay = 0;

    // ctx.beginPath();
    // for ( let i = 0; i < numRays; i++ ) {
    //     let alpha = twoPi * ( i / ( numRays ) ) + this.phi;
    //     if ( i % 2 == 0 ) {
    //         calculateRay = baseR + raySize + ( rayDiff * ( i % 4 == 0 ? invWave : wave ) );
    //         ctx.lineTo(
    //             x + Math.cos( alpha ) * calculateRay,
    //             y + Math.sin( alpha ) * calculateRay
    //         );

    //     } else {
    //         let arcMod = raySpread * wave;
    //         ctx.arc( x, y, baseR, alpha - raySpread - arcMod, alpha + raySpread + arcMod );
    //     }

    // }
    // ctx.closePath();
    // ctx.stroke();
    // end straight rays

    // curved rays
    let testCalc = 0;
    let fipper = false;

    ctx.lineCap = 'round';
    
    ctx.beginPath();
    for ( let i = 0; i < numRays; i++ ) {
        let alpha = twoPi * ( i / ( numRays ) ) + this.phi;
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRays ) ) + this.phi;

        testCalc = baseR + raySize + ( rayDiff * ( fipper == true ? invWave : wave ) );

        if ( i === 0 ) {

            ctx.moveTo(
                x + Math.cos( alpha ) * testCalc,
                y + Math.sin( alpha ) * testCalc,
                );

        } else {

            ctx.quadraticCurveTo(
                x + Math.cos( alpha ) * baseR,
                y + Math.sin( alpha ) * baseR,
                x + Math.cos( alpha2 ) * testCalc,
                y + Math.sin( alpha2 ) * testCalc,
                );

            i++;
        }
        fipper = !fipper;
    }
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
    // end curved rays

    this.phi += 0.005;

}

module.exports = sunCorona;
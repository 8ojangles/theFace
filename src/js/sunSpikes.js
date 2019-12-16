var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;

var randI = require('./mathUtils.js').mathUtils.randomInteger;
var numspike = 8;
var spikeSize = 1600;

var sunSpikes = {
    
    numspike: numspike,
    rotation: ( 2 * Math.PI / numspike ),
    halfRotation: ( 2 * Math.PI / numspike ) / 2,

    renderCfg: {
        canvas: null,
        context: null,
        debugCfg: null
    },

    displayCfg: {
        glareSpikesRandom: {
            isRendered: false,
            isDisplayed: false,
            canvas: null,
            context: null,
            x: 0,
            y: 0
        },
    },

    glareSpikeOptions: {
        x: 150,
        y: 150,
        r: 50,
        majorRayLen: 50,
        majorRayWidth: 0.5,
        minorRayWidth: 0.5,
        angle: Math.PI / 0,
        count: 16,
        blur: 15
    },

    glareSpikeRandomOptions: {
        x: 150,
        y: 150,
        r: 50,
        majorRayLen: 50,
        majorRayWidth: 0.5,
        minorRayWidth: 0.5,
        angle: Math.PI / 0,
        count: 16,
        blur: 15
    },

    flareOptions: {
        context: null,
        canvas: null,
        x: 150,
        y: 150,
        r: 50,
        rayLen: 800,
        flareWidth: 0.1,
        angle: Math.PI / 0,
        count: 6,
        blur: 8
    },

    glareSpikeControlInputCfg: {

        r: { id: 'spikeRadiusInput', min: 0, max: 0, curr: 0, rev: false },
        majorRayLen: { id: 'spikeMajorSize', min: 0, max: 2000, curr: 0, rev: false },
        minorRayLen: { id: 'spikeMinorSize', min: 0, max: 500, curr: 0, rev: false },
        majorRayWidth: {id: 'spikeMajorWidth',  min: 0, max: 2, curr: 0, rev: true },
        minorRayWidth: { id: 'spikeMinorWidth', min: 0, max: 2, curr: 0, rev: true },
        count: { id: 'spikeCountInput', min: 4, max: 100, curr: 0, rev: false },
        blur: { id: 'spikeBlurAmount', min: 0, max: 100, curr: 10, rev: false }

    },

    initGlareSpikeControlInputs: function( stage ) {

        let thisCfg = this.glareSpikeControlInputCfg;
        let currOpts = this.glareSpikeOptions;

        thisCfg.r.curr = currOpts.r;
        thisCfg.r.max = thisCfg.r.curr * 2;

        $( '#'+thisCfg.r.id )
            .attr( {
                    'min': thisCfg.r.min,
                    'max': thisCfg.r.max,
                    'value': thisCfg.r.curr
                } )
                .prop( {
                    'min': thisCfg.r.min,
                    'max': thisCfg.r.max,
                    'value': thisCfg.r.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.r.curr );

        thisCfg.majorRayLen.curr = currOpts.majorRayLen;

        $( '#'+thisCfg.majorRayLen.id )
            .attr( {
                    'min': thisCfg.majorRayLen.min,
                    'max': thisCfg.majorRayLen.max,
                    'value': thisCfg.majorRayLen.curr
                } )
                .prop( {
                    'min': thisCfg.majorRayLen.min,
                    'max': thisCfg.majorRayLen.max,
                    'value': thisCfg.majorRayLen.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.majorRayLen.curr );

        thisCfg.minorRayLen.curr = currOpts.minorRayLen;

        $( '#'+thisCfg.minorRayLen.id )
            .attr( {
                    'min': thisCfg.minorRayLen.min,
                    'max': thisCfg.minorRayLen.max,
                    'value': thisCfg.minorRayLen.curr
                } )
                .prop( {
                    'min': thisCfg.minorRayLen.min,
                    'max': thisCfg.minorRayLen.max,
                    'value': thisCfg.minorRayLen.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.minorRayLen.curr );

        thisCfg.count.curr = currOpts.count;

        $( '#'+thisCfg.count.id )
            .attr( {
                    'min': thisCfg.count.min,
                    'max': thisCfg.count.max,
                    'value': thisCfg.count.curr
                } )
                .prop( {
                    'min': thisCfg.count.min,
                    'max': thisCfg.count.max,
                    'value': thisCfg.count.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.count.curr );

        thisCfg.blur.curr = currOpts.blur;
        // console.log( 'currOpts.blur: ', currOpts.blur );
        // console.log( 'thisCfg.blur.curr: ', thisCfg.blur.curr );
        $( '#'+thisCfg.blur.id )
            .attr( {
                    'min': thisCfg.blur.min,
                    'max': thisCfg.blur.max,
                    'value': thisCfg.blur.curr
                } )
                .prop( {
                    'min': thisCfg.blur.min,
                    'max': thisCfg.blur.max,
                    'value': thisCfg.blur.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.blur.curr );

        thisCfg.majorRayWidth.curr = currOpts.majorRayWidth * thisCfg.majorRayWidth.max;
        $( '#'+thisCfg.majorRayWidth.id )
            .attr( {
                    'min': -thisCfg.majorRayWidth.max,
                    'max': thisCfg.majorRayWidth.max,
                    'value': thisCfg.majorRayWidth.curr
                } )
                .prop( {
                    'min': -thisCfg.majorRayWidth.max,
                    'max': thisCfg.majorRayWidth.max,
                    'value': thisCfg.majorRayWidth.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.majorRayWidth.curr );

        thisCfg.minorRayWidth.curr = currOpts.minorRayWidth * thisCfg.minorRayWidth.max;
        $( '#'+thisCfg.minorRayWidth.id )
            .attr( {
                    'min': -thisCfg.minorRayWidth.min,
                    'max': thisCfg.minorRayWidth.max,
                    'value': thisCfg.minorRayWidth.curr
                } )
                .prop( {
                    'min': -thisCfg.minorRayWidth.min,
                    'max': thisCfg.minorRayWidth.max,
                    'value': thisCfg.minorRayWidth.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.minorRayWidth.curr );
    },

    clearRenderCtx: function() {
        let renderCfg = this.renderCfg;
        renderCfg.context.clearRect(
            0, 0, renderCfg.canvas.width, renderCfg.canvas.height

        );
    }
}




var randomW = [];
var randomH = [];

for (var i = 100; i >= 0; i--) {
    randomW.push( randI( 100, 200 ) );
}

for (var i = 100; i >= 0; i--) {
    randomH.push( randI( 20, 100 ) );
}

sunSpikes.render = function( x, y, imgeCfg, ctx ) {

    const image = imgeCfg;
    let currRotation = this.halfRotation;

    ctx.translate( x, y );

    for ( let i = 0; i < numspike; i++ ) {
        
        ctx.rotate( currRotation );

        ctx.drawImage(
            // source
            image.canvas, image.x, image.y, image.w, image.h,
            // destination
            0, -image.h / 2, image.w, image.h
        );
        ctx.rotate( -currRotation );
        currRotation += this.rotation;  
        
    }
    
    ctx.translate( -x, -y );
}

sunSpikes.renderRainbowSpikes = function( options, context ) {

    const ctx = context;
    const debugConfig = this.renderCfg.debugCfg;
    const baseOpts = this.glareSpikeOptions;
    const opts = options;
    console.log( 'opts: ', opts );
    // configuration
    const x = opts.x || baseOpts.x || ctx.width / 2;
    const y = opts.y || baseOpts.y;
    const a = opts.angle || baseOpts.angle;
    const d = opts.d || baseOpts.d || 200;
    const numRays = opts.count || baseOpts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || baseOpts.r || 150;
    const curveR = opts.curveR || baseOpts.curveR || baseR;

    const image = opts.imageCfg;
    const imgSrc = image.src;
    let amt = numRays;
    let rotation = ( 2 * Math.PI / amt );
    // let halfRotation = ( 2 * Math.PI / amt ) / 2;
    let currRotation = rotation;
    let widthScale = image.w * 2;
    let heightScale = image.h * 3;

    let currBlend = ctx.globalCompositeOperation;


    ctx.globalAlpha = 0.6;
    // ctx.globalCompositeOperation = 'hue';

    ctx.translate( x, y );
    ctx.rotate( -a );
    for ( let i = 0; i < amt; i++ ) {
        ctx.rotate( currRotation );
        ctx.fillStyle = 'red';
        ctx.fillCircle( 0, 0, 10 );
        ctx.drawImage(
            // source
            imgSrc, 0, 0, image.w, image.h,
            // destination
            d, -( heightScale/2 ), widthScale, heightScale
        );
        ctx.rotate( -currRotation );
        currRotation += rotation;  
        
    }
    ctx.rotate( a );
    ctx.translate( -x, -y );

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation = currBlend;

    // output config for renders
    this.displayCfg.rainbowSpikes = {
        x: x - ( d + widthScale ),
        y: y - ( d + widthScale ), 
        w: ( d * 2 ) + ( widthScale * 2 ),
        h: ( d * 2 ) + ( widthScale * 2 )
    }
}

sunSpikes.clearAssetCanvas = function( ctx, canvas ) {
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
}

sunSpikes.renderGlareSpikes = function( options ) {

    const ctx = this.renderCfg.context;
    const debugConfig = this.renderCfg.debugCfg
    const opts = options || this.glareSpikeOptions;

    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;

    const majorRayLen = baseR + opts.majorRayLen || baseR + 300;
    const minorRayLen = baseR + opts.minorRayLen || baseR + opts.majorRayLen / 2 || baseR + 150;

    const majorRayInputFlipped = 1 - opts.majorRayWidth;
    const minorRayInputFlipped = 1 - opts.minorRayWidth;
    const maxRayWidth = twoPi / numRaysMultiple;
    const majorRayWidth = majorRayInputFlipped * maxRayWidth;
    const minorRayWidth = minorRayInputFlipped * maxRayWidth;

    const blur = opts.blur || 10;

    const shadowRenderOffset = debugConfig.displayGlareSpikes === false ? 100000 : 0;
    
    let flipper = true;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y - shadowRenderOffset );
    ctx.rotate( -a );
 
    ctx.beginPath();
    for ( let i = 0; i < numRaysMultiple; i++ ) {

        let iNumRays = i / numRays;
        let iNumRaysMulti = i / numRaysMultiple;

        let alpha = twoPi * ( i / ( numRaysMultiple ) );
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

        let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

        let curve1Alpha = alphaMidPoint - ( flipper ? minorRayWidth : majorRayWidth );
        let curve2Alpha = alphaMidPoint + ( flipper ? majorRayWidth : minorRayWidth );

        let flippedRaySize = flipper ? majorRayLen : minorRayLen;

        if ( i === 0 ) {
            ctx.moveTo(
                Math.cos( alpha ) * flippedRaySize,
                Math.sin( alpha ) * flippedRaySize,
                );
        } else {

            ctx.bezierCurveTo(
                Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR,
                Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR,
                Math.cos( alpha2 ) * flippedRaySize,
                Math.sin( alpha2 ) * flippedRaySize
            );

            i++;
        }

        flipper = !flipper;

        if ( i === numRaysMultiple - 1 ) {
            break;
        }
    }
    ctx.closePath();


    if ( !debugConfig.displayGlareSpikes ) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowRenderOffset;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    ctx.rotate( a );
    ctx.translate( -x, -y + shadowRenderOffset );

    // debug display

    let debugFlipper = true;
    let debugCurveR = curveR;
    let debugTextOffset = 30;

    if ( debugConfig.displayGlareSpikes ) {
        ctx.translate( x, y );
        
        ctx.font = "normal 14px Tahoma";
        ctx.fillStyle = "#666666";
        ctx.setLineDash( [ 1, 6 ] );

        ctx.strokeCircle( 0, 0, baseR );
        // ctx.fillText( 'Radius', baseR + 10, 0 );

        ctx.strokeCircle( 0, 0, debugCurveR );
        ctx.fillText( 'Curve Point Radius', debugCurveR + 10, 0 );

        ctx.strokeCircle( 0, 0, minorRayLen );
        ctx.fillText( 'Minor Spike Radius', minorRayLen + 10, 0 );

        ctx.strokeCircle( 0, 0, majorRayLen );
        let textMetrics = ctx.measureText("Major Spike Radius");
        let textW = textMetrics.width + 10;
        ctx.fillText( 'Major Spike Radius', majorRayLen - textW, 0 );

        ctx.setLineDash( [] );

        ctx.rotate( -a );

        ctx.font = "normal 14px Tahoma";

        // points and lines
        for ( let i = 0; i < numRaysMultiple; i++ ) {

            let iNumRays = i / numRays;
            let iNumRaysMulti = i / numRaysMultiple;
            let alpha = twoPi * ( i / ( numRaysMultiple ) );
            let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

            let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

            let curve1Alpha = alphaMidPoint - ( debugFlipper ? minorRayWidth : majorRayWidth );
            let curve2Alpha = alphaMidPoint + ( debugFlipper ? majorRayWidth : minorRayWidth );

            let debugLineAlpha = twoPi * ( i / numRaysMultiple );
            let debugFlippedRaySize = debugFlipper ? majorRayLen : minorRayLen;

            if ( i === 0 ) {

                // first point
                ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.strokeStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.fillCircle(
                    Math.cos( alpha ) * debugFlippedRaySize,
                    Math.sin( alpha ) * debugFlippedRaySize,
                    5
                    );
                ctx.line( 
                    0, 0, 
                    Math.cos( alpha ) * debugFlippedRaySize,
                    Math.sin( alpha ) * debugFlippedRaySize
                )

                ctx.fillText( i, Math.cos( alpha ) * ( debugFlipper ? majorRayLen : minorRayLen + debugTextOffset ),
                    Math.sin( alpha ) * debugFlippedRaySize + debugTextOffset );

            } else {

                // centre angle of control points
                ctx.setLineDash( [ 1, 6 ] );
                ctx.line( 0, 0, Math.cos( alphaMidPoint ) * majorRayLen, Math.sin( alphaMidPoint ) * majorRayLen );
                ctx.strokeCircle( 0, 0, curveR );
                ctx.setLineDash( [] );


                // first control point of curve ( minus from centre point )
                if ( debugFlipper ) {
                    ctx.fillStyle = 'green';
                    ctx.strokeStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                }

                ctx.fillCircle( Math.cos( curve1Alpha ) * debugCurveR, Math.sin( curve1Alpha ) * debugCurveR,
                    3
                    );
                ctx.line( 0, 0, Math.cos( curve1Alpha ) * debugCurveR, Math.sin( curve1Alpha ) * debugCurveR );

                // ctx.fillText( i, Math.cos( curve1Alpha ) * ( debugCurveR + debugTextOffset ), Math.sin( curve1Alpha ) * ( debugCurveR + debugTextOffset ) );



                // second control point of curve ( plus from centre point )
                if ( !debugFlipper ) {
                    ctx.fillStyle = 'green';
                    ctx.strokeStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                }

                ctx.fillCircle(
                    Math.cos( curve2Alpha ) * debugCurveR, Math.sin( curve2Alpha ) * debugCurveR,
                    3
                    );
                // ctx.fillText( i, Math.cos( curve2Alpha ) * ( debugCurveR + debugTextOffset ), Math.sin( curve2Alpha ) * ( debugCurveR + debugTextOffset ) );
                ctx.line( 0, 0, Math.cos( curve2Alpha ) * debugCurveR, Math.sin( curve2Alpha ) * debugCurveR );



                // end point of curve
                ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.strokeStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.fillCircle(
                    Math.cos( alpha2 ) * debugFlippedRaySize, Math.sin( alpha2 ) * debugFlippedRaySize,
                    5
                    );
                ctx.fillText(
                    i + 1, 
                    Math.cos( alpha2 ) * ( debugFlippedRaySize + debugTextOffset ),
                    Math.sin( alpha2 ) * ( debugFlippedRaySize + debugTextOffset )
                );
                ctx.line(
                    0, 0,
                    Math.cos( alpha2 ) * debugFlippedRaySize,
                    Math.sin( alpha2 ) * debugFlippedRaySize
                );

                i += 1;
            }

            debugFlipper = !debugFlipper;

            if ( i === numRaysMultiple - 1 ) {
                break;
            }
        }

        // hulls
        ctx.strokeStyle = 'white';

        ctx.beginPath();

        let hullFlipper = true;
        for ( let i = 0; i < numRaysMultiple; i++ ) {

            let iNumRays = i / numRays;
            let iNumRaysMulti = i / numRaysMultiple;
            let alpha = twoPi * ( i / ( numRaysMultiple ) );
            let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

            let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

            let curve1Alpha = alphaMidPoint - ( hullFlipper ? minorRayWidth : majorRayWidth );
            let curve2Alpha = alphaMidPoint + ( hullFlipper ? majorRayWidth : minorRayWidth );

            let flippedRaySize = hullFlipper ? majorRayLen : minorRayLen;

            if ( i === 0 ) {
                ctx.moveTo(
                    Math.cos( alpha ) * flippedRaySize,
                    Math.sin( alpha ) * flippedRaySize,
                    );
            } else {
                ctx.lineTo( Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR );
                ctx.lineTo( Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR );
                ctx.lineTo( Math.cos( alpha2 ) * flippedRaySize, Math.sin( alpha2 ) * flippedRaySize );

                i++;
            }

            hullFlipper = !hullFlipper;

            if ( i === numRaysMultiple - 1 ) {
                break;
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash( [] );


        ctx.rotate( a );
        ctx.translate( -x, -y );
    }

    let maxRayLen = majorRayLen > minorRayLen ? majorRayLen : minorRayLen;

    // output config for renders
    this.displayCfg.glareSpikes = {
        x: x - maxRayLen - 10,
        y: y - maxRayLen - 10, 
        w: maxRayLen * 2 + 20,
        h: maxRayLen * 2 + 20
    }
}

sunSpikes.renderGlareSpikesRandom = function( options ) {

    const ctx = this.renderCfg.context;
    const debugConfig = this.renderCfg.debugCfg
    const opts = options || this.glareSpikeRandomOptions;

    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;

    let maxSize = opts.majorRayLen || 600;
    let minSize = opts.minorRayLen || 300;

    let randomSize = []; 
    for (var i = numRaysMultiple; i >= 0; i--) {
        randomSize.push( randI( minSize, maxSize ) );
    }

    // const majorRayLen = baseR + opts.majorRayLen || baseR + 300;
    // const minorRayLen = baseR + opts.minorRayLen || baseR + opts.majorRayLen / 2 || baseR + 150;

    const majorRayInputFlipped = 1 - opts.majorRayWidth;
    const minorRayInputFlipped = 1 - opts.minorRayWidth;
    const maxRayWidth = twoPi / numRaysMultiple;
    const majorRayWidth = majorRayInputFlipped * maxRayWidth;
    const minorRayWidth = minorRayInputFlipped * maxRayWidth;

    const blur = opts.blur || 10;

    const shadowRenderOffset = debugConfig.displayGlareSpikes === false ? 100000 : 0;
    


    let flipper = true;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y - shadowRenderOffset );
    ctx.rotate( -a );
 
    ctx.beginPath();
    for ( let i = 0; i < numRaysMultiple; i++ ) {

        let iNumRays = i / numRays;
        let iNumRaysMulti = i / numRaysMultiple;

        let alpha = twoPi * ( i / ( numRaysMultiple ) );
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

        let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

        let curve1Alpha = alphaMidPoint - maxRayWidth;
        let curve2Alpha = alphaMidPoint + maxRayWidth;

        if ( i === 0 ) {
            ctx.moveTo(
                Math.cos( alpha ) * ( baseR + randomSize[ i ] ),
                Math.sin( alpha ) * ( baseR + randomSize[ i ] ),
                );
        } else {

            ctx.bezierCurveTo(
                Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR,
                Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR,
                Math.cos( alpha2 ) * ( baseR + randomSize[ i + 1 ] ),
                Math.sin( alpha2 ) * ( baseR + randomSize[ i + 1 ] )
            );

            i++;
        }
        console.log( )
        flipper = !flipper;

        if ( i === numRaysMultiple - 1 ) {
            break;
        }
    }
    ctx.closePath();


    if ( !debugConfig.displayGlareSpikes ) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowRenderOffset;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    ctx.rotate( a );
    ctx.translate( -x, -y + shadowRenderOffset );

    // debug display

    let maxRayLen = maxSize;

    // output config for renders
    this.displayCfg.glareSpikesRandom.render = {
        x: x - maxRayLen - 10,
        y: y - maxRayLen - 10, 
        w: maxRayLen * 2 + 20,
        h: maxRayLen * 2 + 20
    }

    this.displayCfg.glareSpikesRandom.isRendered = true;

}

sunSpikes.displayCorona = function() {
    let glareSpikeOpts = this.displayCfg.glareSpikesRandom;
    let itemCfg = glareSpikeOpts.render;
    let c = glareSpikeOpts.context;
    let originCanvas = this.renderCfg.canvas;

    if ( glareSpikeOpts.isRendered === false ) {
        this.renderGlareSpikesRandom();
        this.renderFlares();
    }
    if ( !itemCfg ) {
        return;
    }
    if ( glareSpikeOpts.isDisplayed === false ) {
        // console.log( 'itemCfg: ', itemCfg );
        c.drawImage(
            originCanvas,
            itemCfg.x, itemCfg.y, itemCfg.w, itemCfg.h,
            glareSpikeOpts.x - (itemCfg.w / 2 ), glareSpikeOpts.y - (itemCfg.h / 2 ), itemCfg.w, itemCfg.h
        );
        // glareSpikeOpts.isDisplayed = true;

    }

}


sunSpikes.renderFlares = function( options ) {

    const debugConfig = this.renderCfg.debugCfg
    const opts = this.flareOptions;
    const ctx = opts.context || this.renderCfg.context;
    const renderCanvas = opts.canvas || this.renderCfg.canvas;
    const renderOffset = 100000;
    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;
    const rayWidth = opts.rayWidth || 0.2;
    const gradientWidth = opts.gradientWidth || 1000;
    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;
    const blur = opts.blur || 4;
    const rayLen = baseR + opts.rayLen || baseR + 300;

    const maxRayWidth = twoPi / numRays;
    const raySpread = maxRayWidth * rayWidth;
    console.log( 'maxRayWidth: ', maxRayWidth );
    console.log( 'rayWidth: ', rayWidth );
    console.log( 'flare opts: ', opts );
    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y );
    ctx.rotate( -a );
    ctx.filter = 'blur('+blur+'px)';
    let flareGrd = ctx.createRadialGradient( 0, 0, 0, 0, 0, gradientWidth );
    flareGrd.addColorStop( 0, 'rgba( 255, 255, 255, 1' );
    flareGrd.addColorStop( 1, 'rgba( 255, 255, 255, 0' );
    
    ctx.fillStyle = flareGrd;
    
    for ( let i = 0; i < numRays; i++ ) {

        let alpha = twoPi * ( i / ( numRays ) );

        let point1Alpha = alpha - raySpread;
        let point2Alpha = alpha + raySpread;

        ctx.beginPath();
        ctx.moveTo( 0, 0 );

        // ctx.lineTo( 800, -20 );
        // ctx.lineTo( 800, 20 );

        ctx.lineTo( Math.cos( point1Alpha ) * rayLen, Math.sin( point1Alpha ) * rayLen );
        ctx.lineTo( Math.cos( point2Alpha ) * rayLen, Math.sin( point2Alpha ) * rayLen );
        ctx.closePath();
        // ctx.stroke();
        ctx.fill();

    }
    ctx.filter = 'blur(0px)';
    ctx.rotate( a );
    ctx.translate( -x, -y );

    // output config for renders
    this.displayCfg.flares = {
        canvas: renderCanvas,
        x: x - rayLen - 10,
        y: y - rayLen - 10, 
        w: rayLen * 2 + 20,
        h: rayLen * 2 + 20
    }

}

module.exports = sunSpikes;
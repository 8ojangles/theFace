var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;
let mathUtils = require('./mathUtils.js').mathUtils;
let easing = require('./easing.js').easingEquations;
let rand = mathUtils.random;
let randI = mathUtils.randomInteger;
let mCos = Math.cos;
let mSin = Math.sin;

var numFlares = randI( 30, 60 );
var flareSizeArr = [];

for (var i = numFlares - 1; i >= 0; i--) {

    let randomRandomiser = randI( 0, 100 );
    let smallThreshold = numFlares < 30 ? 60 : 75;
    let min = randomRandomiser < 50 ? 15 : 15;
    let max = randomRandomiser < 50 ? 120 : 180;

    flareSizeArr.push(
        randI( min, max )
    );
}

var lensFlare = {
    config: {
        count: numFlares,
        sizeArr: flareSizeArr,
        flareArr: [],
        blur: 0
    },
    renderers: {
        render: {
            canvas: null,
            ctx: null,
            w: 2000,
            h: 2000,
            dX: 0,
            dY: 0,
            totTallest: 0,
            compositeArea: {
                x: 0, y: 0, w: 0, h: 0
            }
        },
        display: {
            canvas: null,
            ctx: null,
            x: 0, y: 0, w: 0, h: 0, a: 0, d: 0
        }
    },

    setRendererElements: function( renderOpts, displayOpts ) {
        let renderCfg = this.renderers.render;
        let displayCfg = this.renderers.display;

        renderCfg.canvas = renderOpts.canvas;
        renderCfg.ctx = renderOpts.ctx;
        renderCfg.canvas.width = renderCfg.w;
        renderCfg.canvas.height = renderCfg.h;

        displayCfg.canvas = displayOpts.canvas;
        displayCfg.ctx = displayOpts.ctx;
        displayCfg.w = displayCfg.canvas.width;
        displayCfg.h = displayCfg.canvas.height;
    },

    setDisplayProps: function( originX, originY, originR, originA ) {
        let displayCfg = this.renderers.display;

        displayCfg.x = originX;
        displayCfg.y = originY;
        displayCfg.a = originA;
        displayCfg.maxD = trig.dist( -( originR * 2 ), -( originR * 2 ), displayCfg.w + ( originR * 2 ), displayCfg.h + ( originR * 2 ) );

        // console.log( 'displayCfg.maxD: ', displayCfg.maxD );
        displayCfg.d = ( trig.dist( originX, originY, displayCfg.w / 2, displayCfg.h / 2 ) ) * 3;
        // console.log( 'displayCfg.d: ', displayCfg.d );
        displayCfg.scale = displayCfg.d / displayCfg.maxD;
        // console.log( 'displayCfg.scale: ', displayCfg.scale );
    },

    createFlareConfigs: function() {
        let cfg = this.config;

        for (let i = cfg.count - 1; i >= 0; i--) {

            let thisTypeRandomiser = randI( 0, 100 );
            let thisType = thisTypeRandomiser < 10 ? 'spotShine' : thisTypeRandomiser < 55 ? 'poly' : 'circle';

            let colRand = randI( 0, 100 );

            let r = colRand < 50 ? 255 : colRand < 60 ? 255 : colRand < 80 ? 200 : 200;
            let g = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 255 : 255;
            let b = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 200 : 255;

            let thisFlare = {
                color: {
                    r: r,
                    g: g,
                    b: b

                },
                type: thisType
            }

            if ( thisType === 'spotShine' ) {
                thisFlare.color = {
                    r: 255, g: 255, b: 255
                }
            }

            thisFlare.size = thisFlare.type === 'spotShine' ? randI( 40, 80 ) : cfg.sizeArr[ i ];

            thisFlare.d = thisFlare.type === 'spotShine' ? parseFloat( rand( 0.3, 1 ).toFixed( 2 ) ) : parseFloat( rand( 0, 1 ).toFixed( 2 ) );

            thisFlare.hRand = parseFloat( rand( 1, 2 ).toFixed( 2 ) );
            cfg.flareArr.push( thisFlare );
        }
    },

    renderCircleFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let baseCfg = this.config;
        let flareCfg = cfg;
        let flareRandomiser = randI( 0, 100 );
        let flareRandomShift = randI( 20, 40 );
        let flareRandomEdge = randI( 0, 10 );
        let randomFill = randI( 0, 100 ) < 20 ? true : false;
        let grad = c.createRadialGradient( 0 - ( flareRandomShift * 3 ), 0, 0, 0, 0, flareCfg.size );
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

            // grad.addColorStop( 0, `rgba( ${ rgbColorString } 0.6 )` );
            // grad.addColorStop( 0.7,  `rgba( ${ rgbColorString } 0.8 )` );
            // grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.7 )` );

        if ( flareRandomEdge > 5 ) {
            if ( randomFill === true ) {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            } else {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.8,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            }
            
            grad.addColorStop( 0.97, `rgba( ${ rgbColorString } 0.8 )` );
            grad.addColorStop( 0.99, `rgba( ${ rgbColorString } 0.3 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0 )` );
        } else {
            grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.2 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0.3 )` );
        }
            
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderSpotFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.2,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.4,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0 )` );
        
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderPolyFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let flareSize = flareCfg.size;
        let flareRandomShift = randI( 0, 40 );

        let flareRandomEdge = randI( 0, 10 );

        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.2 )` );
        
        let sides = 8;

        c.save();
        
        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();
        c.clip();

        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();

        c.fillStyle = grad; 
        c.fill();
        
        c.translate( 0, -100000 );
        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();
        flareRandomShift = randI( 0, 5 );
        c.strokeStyle = 'red';
        c.shadowColor = `rgba( ${ rgbColorString } 1 )`;
        c.shadowBlur = 40;
        c.shadowOffsetX = 0 - flareRandomShift;
        c.shadowOffsetY = 100000;
        c.lineWidth = 10;
        c.stroke();
        c.shadowBlur = 0;

        if ( flareRandomEdge > 5 ) {
            c.beginPath();
            for (let i = 0; i < sides; i++) {
                let alpha = twoPi * ( i / sides );
                if ( i === 0 ) {
                    c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                } else {
                    c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                }
            }
            c.closePath();
            c.strokeStyle = 'red';
            c.shadowColor = `rgba( ${ rgbColorString } 1 )`;
            c.shadowBlur = 3;
            c.shadowOffsetX = 0 - flareRandomShift;
            c.shadowOffsetY = 100000;
            c.lineWidth = 2;
            c.stroke();
            c.shadowBlur = 0;
        }

        c.translate( 0, 100000 );

        c.restore();
    },

    getCleanCoords: function( flare ) {
        
        let renderCfg = this.renderer.render;
        let blur = this.config.blur;
        let blur2 = blur * 2;
        let flareS = flare.size;
        let flareS2 = flareS * 2;
        let totalS = flareS2 + blur2;
        let cleanX = renderCfg.dX;
        let cleanY = renderCfg.dY;
    },

    renderFlares: function() {

        let baseCfg = this.config;
        let renderer = this.renderers.render;
        let compositeArea = renderer.compositeArea;
        let c = renderer.ctx;
        let cW = renderer.w;
        let cH = renderer.h;
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;
        let blur = baseCfg.blur;
        let blur2 = blur * 2;

        let currX = 0;
        let currY = 0;
        let currTallest = 0;

        let blurStr = 'blur('+blur.toString()+'px)';
        c.filter = blurStr;
        let polyCount = 0;

        // sort flares based on size - decending order to map to reverse FOR loop ( so loop starts with smallest ) 
        flares.sort( function( a, b ) {
                return b.size - a.size
            }
        );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let flareSize = thisFlare.size;
            let flareSize2 = flareSize * 2;
            let totalFlareW = flareSize2 + blur2;
            let totalFlareH = flareSize2 + blur2;

            totalFlareH > currTallest ? currTallest = totalFlareH : false;

            if ( currX + totalFlareW + blur > cW ) {
                currX = 0;
                currY += currTallest;
                currTallest = totalFlareH;
            }

            let transX = currX + flareSize + blur;
            let transY = currY + flareSize + blur;

            c.translate( transX, transY );

            if ( thisFlare.type === 'spotShine' ) {
                c.globalAlpha = 1;
                this.renderSpotFlare( 0, 0, thisFlare );
            }

            if ( thisFlare.type === 'poly' ) {
                c.globalAlpha = 1;
                this.renderPolyFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }

            if ( thisFlare.type === 'circle' ) {
                c.globalAlpha = parseFloat( rand( 0.5, 1 ).toFixed( 2 ) );
                this.renderCircleFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }


            // c.strokeStyle = 'red';
            // c.lineWidth = 1;
            // c.strokeRect( -( flareSize + blur ), -( flareSize + blur ), totalFlareW, totalFlareH );
            // c.stroke();

            c.translate( -transX, -transY );

            thisFlare.renderCfg = {
                x: currX,
                y: currY,
                w: totalFlareW,

                h: totalFlareH
            }

            currX += totalFlareW;

            if ( i === 0 ) {
                compositeArea.x = 0;
                compositeArea.y = currY + totalFlareH;
                compositeArea.w = cW;
                compositeArea.h = totalFlareH;
            }

        }

        c.filter = 'blur(0px)';
    },


    displayFlares: function() {

        let baseCfg = this.config;
        let renderC = this.renderers.render.canvas;
        let displayCfg = this.renderers.display;
        let c = displayCfg.ctx;
        
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;

        let scale = displayCfg.scale;

        c.globalCompositeOperation = 'lighten';

        c.translate( displayCfg.x, displayCfg.y );
        c.rotate( displayCfg.a );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let thisFlareCfg = thisFlare.renderCfg;
            // console.log( 'thisFlareCfg: ', thisFlareCfg );
            let scaledCoords = ( thisFlareCfg.w / 2 ) * scale;
            let scaledSize = thisFlareCfg.w * scale;
            let scaledX = displayCfg.d * thisFlare.d;
            let inverseScale = 1 - ( scaledX / displayCfg.d );
            let scaleMultiplier = easing.easeInCubic( scaledX, 1, -1, displayCfg.d );
            // console.log( 'inverseScale: ', inverseScale);
            // console.log( 'scaledSize * inverseScale: ', scaledSize * inverseScale );
            c.drawImage(
                renderC,
                thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                scaledX, -scaledCoords, scaledSize / scaleMultiplier , scaledSize
            );


        }

        c.rotate( -displayCfg.a );
        c.translate( -displayCfg.x, -displayCfg.y );

    },

    compositeFlares: function() {

        let baseCfg = this.config;
        let renderer = this.renderers.render;
        let renderC = renderer.canvas;
        let renderCtx = renderer.ctx;
        let compositeArea = renderer.compositeArea;
        let displayCfg = this.renderers.display;
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;
        let scale = displayCfg.scale;
        let tallestFlare = flares[ 0 ].w * scale;
        let startPos = tallestFlare / 2;

        renderCtx.globalCompositeOperation = 'lighten';

        renderCtx.translate( startPos, compositeArea.y + startPos );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let thisFlareCfg = thisFlare.renderCfg;
            // console.log( 'thisFlareCfg: ', thisFlareCfg );
            let scaledCoords = ( thisFlareCfg.w / 2 ) * scale;
            let scaledSize = thisFlareCfg.w * scale;
            let scaledX = displayCfg.d * thisFlare.d;
            let inverseScale = 1 - ( scaledX / displayCfg.d );
            let scaleMultiplier = easing.easeInCubic( scaledX, 1, -1, displayCfg.d );
            // console.log( 'inverseScale: ', inverseScale);
            // console.log( 'scaledSize * inverseScale: ', scaledSize * inverseScale );
            renderCtx.drawImage(
                renderC,
                thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                scaledX, -scaledCoords, scaledSize / scaleMultiplier , scaledSize
            );


        }


        renderCtx.translate( -startPos, -( compositeArea.y +startPos ) );

    },

    displayComposite: function() {

        let baseCfg = this.config;

        let renderC = this.renderers.render.canvas;
        let compositeArea = this.renderers.render.compositeArea;
        
        let displayCfg = this.renderers.display;
        let c = displayCfg.ctx;

        c.globalCompositeOperation = 'lighten';

        c.translate( displayCfg.x, displayCfg.y );
        c.rotate( displayCfg.a );

        c.drawImage(
            renderC,
            compositeArea.x, compositeArea.y, compositeArea.w, compositeArea.h,
            0, -( compositeArea.h / 2 ), compositeArea.w , compositeArea.h
        );

        c.rotate( -displayCfg.a );
        c.translate( -displayCfg.x, -displayCfg.y );

    },

    clearCompositeArea: function() {

        let c = this.renderers.render.ctx;
        let compositeArea = this.renderers.render.compositeArea;

        c.clearRect( compositeArea.x, compositeArea.y, compositeArea.w, compositeArea.h );

    },

    update: function() {
        this.compositeFlares();
        this.displayComposite();
        this.clearCompositeArea();

    },

    flareInit: function( renderOpts, displayOpts ) {
        self = this;

        self.setRendererElements( renderOpts, displayOpts );
        self.createFlareConfigs();
    }
}

module.exports = lensFlare;
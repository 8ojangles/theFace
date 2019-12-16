// dependencies

// NPM
    var LinkedList = require('dbly-linked-list');
    var objectPath = require("object-path");

// Custom Requires
    var mathUtils = require('./mathUtils.js').mathUtils;
    var trig = require('./trigonomicUtils.js').trigonomicUtils;
    require('./canvasApiAugmentation.js');
    var coloring = require('./colorUtils.js').colorUtils;
    var easing = require('./easing.js').easingEquations;
    var animation = require('./animation.js').animation;
    var debugConfig = require('./debugUtils.js');
    var debug = debugConfig.debug;
    var lastCalledTime = debugConfig.lastCalledTime;
    var environment = require('./environment.js').environment;
    var physics = environment.forces;
    var runtimeEngine = environment.runtimeEngine;
    
    require('./gears.js');
    
    var overlayCfg = require('./overlay.js').overlayCfg;

    var sunCorona = require('./sunCorona.js');
    var sunSpikes = require('./sunSpikes.js');
    var lensFlare = require('./lensFlare.js');
    var sineWave = require('./sineWaveModulator.js').sineWave;
    var proportionalMeasures = require('./proportionalMeasures.js');
    var muscleModifier = require('./muscleModifier.js').muscleModifier;
    var seq = require('./sequencer.js');
    var seqList = seq.seqList;
    var trackPlayer = require('./trackPlayer.js');

// base variables
    var mouseX = 0, 
        mouseY = 0, 
        lastMouseX = 0, 
        lastMouseY = 0, 
        frameRate = 60, 
        lastUpdate = Date.now(),
        mouseDown = false,
        runtime = 0,
        pLive = 0,
        globalClock = 0,
        counter = 0,
        displayOverlay = false;

// create window load function, initialise mouse tracking
    function init() {
        
        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('mousedown', function(e){mouseDown =true; if(typeof onMouseDown == 'function') onMouseDown() ;});
        window.addEventListener('mouseup', function(e){mouseDown = false;if(typeof onMouseUp == 'function') onMouseUp()  ;});
        window.addEventListener('keydown', function(e){if(typeof onKeyDown == 'function') onKeyDown(e)  ;});
        
        // if(typeof window.setup == 'function') window.setup();
        // cjsloop();  
        
    }

    // window load function
    // includes mouse tracking
    window.addEventListener('load',init);

// static asset canvases
let staticAssetCanvas = document.createElement('canvas');
let staticAssetCtx = staticAssetCanvas.getContext("2d");
staticAssetCanvas.width = window.innerWidth * 2;
staticAssetCanvas.height = window.innerHeight * 2;

var staticAssetConfigs = {};
var imageAssetConfigs = {};

let secondaryStaticAssetCanvas = document.createElement('canvas');
let secondaryStaticAssetCtx = secondaryStaticAssetCanvas.getContext("2d");
secondaryStaticAssetCanvas.width = window.innerWidth * 2;
secondaryStaticAssetCanvas.height = window.innerHeight * 2;

let flareAssetCanvas = document.createElement('canvas');
let flareAssetCtx = flareAssetCanvas.getContext("2d");
flareAssetCanvas.width = window.innerWidth * 2;
flareAssetCanvas.height = window.innerHeight * 2;
flareAssetCanvas.id = 'flareAssetCanvas';

let bgGlareCanvas = document.createElement('canvas');
let bgGlareCtx = bgGlareCanvas.getContext("2d");
bgGlareCanvas.width = window.innerWidth;
bgGlareCanvas.height = window.innerHeight;

let lensFlareCanvas = document.createElement('canvas');
let lensFlareCtx = lensFlareCanvas.getContext("2d");



// standard canvas rendering
// canvas housekeeping

//// Screen Renderers

// face layer
var canvas = document.querySelector("#face-layer");
var ctx = canvas.getContext("2d");

var flareLayer = document.querySelector("#flare-layer");
var flareLayerCtx = canvas.getContext("2d");

var coronaLayer = document.querySelector("#corona-layer");
var coronaLayerCtx = canvas.getContext("2d");


// cache canvas w/h
var canW = window.innerWidth;
var canH = window.innerHeight;
var canvasCentreH = canW / 2;
var canvasCentreV = canH / 2;

// set canvases to full-screen
canvas.width = canW;
canvas.height = canH;
flareLayer.width = canW;
flareLayer.height = canH;
coronaLayer.width = canW;
coronaLayer.height = canH;


// set base canvas config
var canvasConfig = {
    width: canW,
    height: canH,
    centerH: canvasCentreH,
    centerV: canvasCentreV,

    bufferClearRegion: {
        x: canvasCentreH,
        y: canvasCentreV,
        w: 0,
        h: 0
    }
};


// set buffer config for use in constrained canvas clear region
var bufferClearRegion = {
    x: canvasCentreH,
    y: canvasCentreV,
    w: 0,
    h: 0
};


// set base config for face
var sunface = {
    colours: {
        base: {
            red: '#aa0000',
            orange: '#FF9C0D',
            yellow: '#bbbb00',
            white: '#FFFFFF',
            whiteShadow: '#DDDDFF'
        },
        rgb: {
            orange: '255, 156, 13',
            whiteShadow: {
                r: 221,
                g: 221,
                b: 255
            }
        },
        rgba: {
            orangeShadow: 'rgba( 255, 156, 13, 0.3 )',
            orangeShadowLight: 'rgba( 255, 156, 13, 0.2 )',
            orangeShadowLightest: 'rgba( 255, 156, 13, 0.1 )',
            orangeShadowDarkLip: 'rgba( 255, 156, 13, 0.4 )',
            orangeShadowDark: 'rgba( 255, 156, 13, 1 )'
        },
        debug: {
            points: '#00aa00',
            handles: '#0000aa',
            lines: '#0055ff',
            orange: 'rgb( 255, 156, 13, 0.2 )',
            dimmed: 'rgba( 255, 150, 40, 0.2 )',
            fills: 'rgba( 255, 150, 40, 0.2 )',
            fillsTeeth: 'rgba( 255, 255, 255, 0.1 )'
        }
    },
    debug: {
        pointR: 4,
        handleR: 2
    },
    r: 250,
    x: canvasCentreH,
    y: canvasCentreV
    // x: 300,
    // y: 850
}

sunface.faceToStageCentreAngle = trig.angle( sunface.x, sunface.y, canvasCentreH, canvasCentreV );

let distToStageCentre = trig.dist( sunface.x, sunface.y, canvasCentreH, canvasCentreV );

function faceToStageCentreDebugLine( ctx ) {
    let currStroke = ctx.strokeStyle;
    let currFill = ctx.fillStyle;

    ctx.strokeStyle = 'rgba( 150, 150, 150, 0.6 )';
    ctx.fillStyle = 'rgba( 150, 150, 150, 1 )';

    ctx.translate( sunface.x, sunface.y );
    ctx.rotate( sunface.faceToStageCentreAngle );

    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( distToStageCentre, 0 );
    ctx.setLineDash( [5, 6] );
    ctx.stroke();
    ctx.setLineDash( [] );

    ctx.fillCircle( 0, 0, 5 );
    ctx.fillCircle( distToStageCentre, 0, 5 );

    ctx.rotate( -sunface.faceToStageCentreAngle );
    ctx.translate( -sunface.x, -sunface.y );

    let sunCtrTxt = 'Sun Centre X: '+sunface.x+' / Y: '+sunface.y;
    let stageCtrTxt = 'Stage Centre X: '+canvasCentreH+' / Y: '+canvasCentreV;

    ctx.fillText( sunCtrTxt, sunface.x + 20, sunface.y );
    ctx.fillText( stageCtrTxt, canvasCentreH + 20, canvasCentreV );

    ctx.strokeStyle = currStroke;
    ctx.fillStyle = currFill;
}

lensFlare.flareInit(
    { canvas: lensFlareCanvas, ctx: lensFlareCtx },
    { canvas: flareLayer, ctx: flareLayerCtx }
);

lensFlare.setDisplayProps( sunface.x, sunface.y, sunface.r, sunface.faceToStageCentreAngle );

lensFlare.renderFlares();
// console.log( 'sunface.faceToStageCentreAngle: ', sunface.faceToStageCentreAngle );


sunSpikes.renderCfg.canvas = staticAssetCanvas;
sunSpikes.renderCfg.context = staticAssetCtx;
sunSpikes.renderCfg.debugCfg = overlayCfg;
sunSpikes.displayCfg.glareSpikesRandom.canvas = coronaLayer;
sunSpikes.displayCfg.glareSpikesRandom.context = coronaLayerCtx;
sunSpikes.displayCfg.glareSpikesRandom.x = sunface.x;
sunSpikes.displayCfg.glareSpikesRandom.y = sunface.y;

sunSpikes.glareSpikeOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: sunface.r / 1.5,
    majorRayLen: 400,
    minorRayLen: 150,
    majorRayWidth: 0.3,
    minorRayWidth: 0.2,
    angle: Math.PI / sunface.faceToStageCentreAngle,
    count: 16,
    blur: 10
}

sunSpikes.glareSpikeRandomOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: sunface.r / 4,
    majorRayLen: sunface.r * 2,
    minorRayLen: sunface.r * 1,
    majorRayWidth: 0.005,
    minorRayWidth: 0.0005,
    angle: Math.PI / sunface.faceToStageCentreAngle,
    count: mathUtils.randomInteger( 20, 40 ),
    blur: 10
}

sunSpikes.flareOptions = {
    canvas: flareAssetCanvas,
    context: flareAssetCtx,
    x: flareAssetCanvas.width / 2,
    y: flareAssetCanvas.height / 2,
    r: sunface.r / 1.9,
    gradientWidth: sunface.r * 8,
    rayLen: sunface.r * 8,
    rayWidth: 0.03,
    angle: Math.PI / sunface.faceToStageCentreAngle,
    count: 6,
    blur: 1

    
}

// console.log( 'sunSpikes.glareSpikeOptions.r: ', sunSpikes.glareSpikeOptions );
sunSpikes.initGlareSpikeControlInputs( canvas );

// console.log( 'sunSpikes.glareSpikeControlInputCfg: ', sunSpikes.glareSpikeControlInputCfg );

// sunSpikes.renderGlareSpikes();
// sunSpikes.renderGlareSpikesRandom();
// sunSpikes.renderFlares();

// images
let rainbowGlare = new Image();   // Create new img element
rainbowGlare.src = 'images/rainbowGlare.png'; // Set source path

let rainbowGlareLong = new Image();   // Create new img element
rainbowGlareLong.src = 'images/rainbowGlareLongStrong.png'; // Set source path
rainbowGlareLongLoaded = false;
rainbowGlareLongCfg = {};

imageAssetConfigs.rainbowGlare = {
    src: rainbowGlare,
    w: 150,
    h: 60
}

rainbowGlareLong.onload = function() {

    imageAssetConfigs.rainbowGlareLong = {
        src: rainbowGlareLong,
        w: 290,
        h: 55
    };

    sunSpikes.renderRainbowSpikes(
        {   
            x: secondaryStaticAssetCanvas.width / 2,
            y: secondaryStaticAssetCanvas.height / 2,
            imageCfg: imageAssetConfigs.rainbowGlareLong,
            d: 400,
            count: 2
        },
        secondaryStaticAssetCtx
    );

    rainbowGlareLongLoaded = true;
    rainbowGlareLongCfg = sunSpikes.displayCfg.rainbowSpikes;
}

let rainbowRealImage = new Image();
rainbowRealImage.src = 'images/rainblowArcFlareReal.png';
rainbowRealImageLoaded = false;
rainbowRealImageCfg = {
    w: 1024,
    h: 1024
};

rainbowRealImage.onload = function() {
    rainbowRealImageLoaded = true;
}
// set line widths for drawing based on scene size
sunface.lines = {
    outer: Math.floor( sunface.r / 20 ),
    inner: Math.floor( sunface.r / 40 )
}


// set corona system base size
sunCorona.rayBaseRadius = sunface.r * 1.2;


// set up proprtional measurements from face radius
var pm = proportionalMeasures.setMeasures( sunface.r );

var coronaGradient = ctx.createRadialGradient(sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 3 );
    coronaGradient.addColorStop(0, "rgba( 255, 255, 180, 1 )");
    coronaGradient.addColorStop(1, "rgba( 255, 255, 180, 0 )");


var coronaGradient2 = ctx.createRadialGradient(sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 10 );
    coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
    // coronaGradient2.addColorStop( 0.88, "rgba( 255, 255, 255, 0 )" );
    // coronaGradient2.addColorStop( 0.89, "rgba( 255, 255, 255, 0.8 )" );
    // coronaGradient2.addColorStop( 0.9, "rgba( 255, 255, 255, 0 )" );
    coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );

var coronaGradient3 = ctx.createRadialGradient(sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 5 );
    coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
    // coronaGradient2.addColorStop( 0.88, "rgba( 255, 255, 255, 0 )" );
    // coronaGradient2.addColorStop( 0.89, "rgba( 255, 255, 255, 0.8 )" );
    // coronaGradient2.addColorStop( 0.9, "rgba( 255, 255, 255, 0 )" );
    coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );

var faceGradient = ctx.createRadialGradient(sunface.x, sunface.y, 0, sunface.x, sunface.y + pm.r8, sunface.r );
    faceGradient.addColorStop( 0, "rgba( 255, 255, 100, 1 )" );
    faceGradient.addColorStop( 0.7, "rgba( 255, 255, 100, 1 )" );
    faceGradient.addColorStop( 1, "rgba( 255, 255, 100, 0 )" );

var featureCreaseVerticalGradient = ctx.createLinearGradient(
    sunface.x, sunface.y, sunface.x, sunface.y + sunface.r );
    featureCreaseVerticalGradient.addColorStop(0, "rgba( 255, 156, 13, 1 )");
    featureCreaseVerticalGradient.addColorStop(1, "rgba( 255, 156, 13, 0 )");

let rainbow = ctx.createRadialGradient( sunface.x, sunface.y, sunface.r, sunface.x, sunface.y, sunface.r * 3 );
    rainbow.addColorStop( 0.4, "rgba( 255, 0, 0, 0 )" );
    rainbow.addColorStop( 0.5, "rgba( 255, 0, 0, 0.2 )" );
    rainbow.addColorStop( 0.6, "rgba( 0, 255, 0, 0.2 )" );
    rainbow.addColorStop( 0.7, "rgba( 0, 0, 255, 0.2 )" );
    rainbow.addColorStop( 0.8, "rgba( 0, 0, 255, 0 )" );



// set face colour
var faceOutlineColor = sunface.colours.base.orange;


// set up initial face coordinate vars
var eyeBaseY = sunface.y - ( pm.r3 - pm.r32 );
var leftEyeBaseX = sunface.x - pm.r2 + pm.r16 + pm.r32;
var leftEyeBaseY = eyeBaseY;
var rightEyeBaseX = sunface.x + pm.r2 - pm.r16 - pm.r32;
var rightEyeBaseY = eyeBaseY;
var eyeBaseRadius = pm.r5;

var eyebrowBaseY = eyeBaseY - pm.r24;

var mouthBaseX = sunface.x;
var mouthBaseY = sunface.y + pm.r3 + pm.r12;
var mouthBaseRadius = pm.r3;

var teethBaseCentreY = mouthBaseY - pm.r32;

// declare base config for look constraint
var aimConstraint = {
    target: {

        renderConfig: {
            radius: 30,
            baseRadius: 30,
            roundelScale: 10,
            isHit: false,
            isHighlighted: false,
            isMoving: false
        },

        config: {
            x: {
                ctrlId: 'lookTargetX',
                min: 0,
                max: canW
            },
            y: {
                ctrlId: 'lookTargetY',
                min: 0,
                max: canH,
            },
            z: {
                ctrlId: 'lookTargetZ',
                min: 100,
                max: 3000
            }
        },
        coords: {
            mouseOffset: {
                x: 0,
                y: 0
            },
            base: {
                x: canvasConfig.centerH,
                y: canvasConfig.centerV,
                z: 2000
            },
            curr: {
                x: canvasConfig.centerH,
                y: canvasConfig.centerV,
                z: 2000
            }
        }
    },
    eyes: {

        config: {
            r: eyeBaseRadius
        },

        left: {
            coords: {
                x: leftEyeBaseX,
                y: leftEyeBaseY,
                z: 0
            },
            angles: {
                xy: 0,
                zy: 0,
                xz: 0
            },
            computed: {
                x: 0,
                y: 0
            }
        },
        right: {
            coords: {
                x: rightEyeBaseX,
                y: leftEyeBaseY,
                z: 0
            },
            angles: {
                xy: 0,
                zy: 0,
                xz: 0
            },
            computed: {
                x: 0,
                y: 0
            }
        }
    },

    computeTargetAngles: function() {

        // base eye config
        var eyeConfig = this.eyes.config;

        // target
        var targetCoords = this.target.coords.curr;

        // leftEye
        var leftEyeCoords = this.eyes.left.coords;
        var leftEyeAngles = this.eyes.left.angles;
        var rightEyeCoords = this.eyes.right.coords;
        var rightEyeAngles = this.eyes.right.angles;

        // get zy and xy angles ( in radians ) from eye to target 
        var leftAngleZY = trig.angle( leftEyeCoords.z, leftEyeCoords.y, targetCoords.z, targetCoords.y );
        var leftAngleXZ = trig.angle( leftEyeCoords.x, leftEyeCoords.z, targetCoords.x, targetCoords.z );
        // console.log( 'leftAngleZY/leftAngleXZ: ', trig.radiansToDegrees( leftAngleZY ) + ', '+trig.radiansToDegrees( leftAngleXZ ) );

        // get eye position XY from computed angles
        this.eyes.left.computed.x = eyeConfig.r * Math.cos( leftAngleXZ );
        this.eyes.left.computed.y = eyeConfig.r * Math.sin( leftAngleZY );

        // get zy and xy angles ( in radians ) from eye to target 
        var rightAngleZY = trig.angle( rightEyeCoords.z, rightEyeCoords.y, targetCoords.z, targetCoords.y );
        var rightAngleXZ = trig.angle( rightEyeCoords.x, rightEyeCoords.z, targetCoords.x, targetCoords.z );
        // console.log( 'rightAngleZY/rightAngleXZ: ', trig.radiansToDegrees( rightAngleZY ) + ', '+trig.radiansToDegrees( rightAngleXZ ) );

        // get eye position XY from computed angles
        this.eyes.right.computed.x = eyeConfig.r * Math.cos( rightAngleXZ );
        this.eyes.right.computed.y = eyeConfig.r * Math.sin( rightAngleZY );
    },

    setHudControlsConfig: function() {

        var self = this.target.config;
        var selfCoords = this.target.coords;

        $( '#'+self.x.ctrlId )
            .attr( {
                'min': self.x.min,
                'max': self.x.max,
                'value': selfCoords.curr.x
            } )
            .prop( {
                'min': self.x.min,
                'max': self.x.max,
                'value': selfCoords.curr.x
            } )
            .closest( '.control--panel__item' )
            .find( 'output' )
            .html( selfCoords.curr.x / self.x.max );

        $( '#'+self.y.ctrlId )
            .attr( {
                'min': self.y.min,
                'max': self.y.max,
                'value': selfCoords.curr.y
            } )
            .prop( {
                'min': self.y.min,
                'max': self.y.max,
                'value': selfCoords.curr.y
            } )
            .closest( '.control--panel__item' )
            .find( 'output' )
            .html( selfCoords.curr.y / self.y.max );

        $( '#'+self.z.ctrlId )
            .attr( {
                'min': self.z.min,
                'max': self.z.max,
                'value': selfCoords.curr.z
            } )
            .prop( {
                'min': self.z.min,
                'max': self.z.max,
                'value': selfCoords.curr.z
            } )
            .closest( '.control--panel__item' )
            .find( 'output' )
            .html( selfCoords.curr.z / self.z.max );

            this.setCurrentSize();
    },

    setCurrentSize: function() {
        var self = this.target.coords.curr;
        var selfRenderCfg = this.target.renderConfig;
        selfRenderCfg.radius = selfRenderCfg.baseRadius + ( self.z / 50 );
    },

    renderTarget: function() {

        var self = this.target.coords.curr;
        var selfRenderCfg = this.target.renderConfig;
        ctx.strokeStyle = 'red';

        if ( !selfRenderCfg.isHighlighted ) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 4;
        }
        
        ctx.setLineDash([]);

        ctx.line( self.x - selfRenderCfg.radius, self.y, self.x + selfRenderCfg.radius, self.y );
        ctx.line( self.x, self.y - selfRenderCfg.radius, self.x, self.y + selfRenderCfg.radius );
        ctx.strokeCircle( self.x, self.y, selfRenderCfg.radius );
    },

    checkMouseHit: function() {
        var selfRenderCfg = this.target.renderConfig;
        var thisCoords = this.target.coords.curr;
        var mouseOffset = this.target.coords.mouseOffset;

        var mouseTargetDist = trig.dist( mouseX, mouseY, thisCoords.x, thisCoords.y );

        if ( mouseTargetDist < selfRenderCfg.radius ) {

            if ( !selfRenderCfg.isHit ) {
                this.setMouseOffset();
                selfRenderCfg.isHit = true;
                selfRenderCfg.isHighlighted = true;
            }

        } else {
            this.target.renderConfig.isHighlighted = false;
        }

    },

    setMouseOffset: function() {
        var thisCoords = this.target.coords.curr;
        var mouseOffset = this.target.coords.mouseOffset;
        mouseOffset.x = mouseX - thisCoords.x;
        mouseOffset.y = mouseY - thisCoords.y;
    },

    mouseMoveTarget: function() {
        var selfRenderCfg = this.target.renderConfig;
        var thisCoords = this.target.coords.curr;
        var mouseOffset = this.target.coords.mouseOffset;
        if ( selfRenderCfg.isHighlighted ) {

            thisCoords.x = mouseX - mouseOffset.x;
            thisCoords.y = mouseY - mouseOffset.y;

        }
    },

    clearActiveTarget: function() {
        var selfRenderCfg = this.target.renderConfig;
        selfRenderCfg.isHit = false;
        selfRenderCfg.isHighlighted = false;

    }
}

function onMouseUp() {
    aimConstraint.clearActiveTarget();
}

// set up look constraint for eye move system
aimConstraint.setHudControlsConfig();
aimConstraint.computeTargetAngles();


// create face coordinate measures
var baseFaceCoords = {

    eyes: {
        pupils: {
            left: {
                x: leftEyeBaseX,
                y: leftEyeBaseY,
                r: pm.r16
            },
            right: {
                x: rightEyeBaseX,
                y: rightEyeBaseY,
                r: pm.r16
            }
        },
        left: {
            lPointX: leftEyeBaseX - eyeBaseRadius, 
            lPointY: leftEyeBaseY,
            tHandleX: leftEyeBaseX,
            tHandleY: leftEyeBaseY - pm.r5,
            rPointX: leftEyeBaseX + eyeBaseRadius, 
            rPointY: leftEyeBaseY,
            bHandleX: leftEyeBaseX,
            bHandleY: leftEyeBaseY + pm.r6
        },
        right: {
            lPointX: rightEyeBaseX - eyeBaseRadius, 
            lPointY: rightEyeBaseY,
            tHandleX: rightEyeBaseX,
            tHandleY: rightEyeBaseY - pm.r5,
            rPointX: rightEyeBaseX + eyeBaseRadius, 
            rPointY: rightEyeBaseY,
            bHandleX: rightEyeBaseX,
            bHandleY: rightEyeBaseY + pm.r6
        }
    },

    eyebrows: {
        left: {
            lPointX: leftEyeBaseX - (eyeBaseRadius * 1.5), 
            lPointY: eyebrowBaseY,
            handle1X: leftEyeBaseX - pm.r8,
            handle1Y: eyebrowBaseY - pm.r4,
            handle2X: leftEyeBaseX + pm.r8,
            handle2Y: eyebrowBaseY - pm.r4,
            rPointX: leftEyeBaseX + (eyeBaseRadius * 1.5), 
            rPointY: eyebrowBaseY
        },
        right: {
            lPointX: rightEyeBaseX - (eyeBaseRadius * 1.5), 
            lPointY: eyebrowBaseY,
            handle1X: rightEyeBaseX - pm.r8,
            handle1Y: eyebrowBaseY - pm.r4,
            handle2X: rightEyeBaseX + pm.r8,
            handle2Y: eyebrowBaseY - pm.r4,
            rPointX: rightEyeBaseX + (eyeBaseRadius * 1.5), 
            rPointY: eyebrowBaseY
        }

    },

    nose: {
        point1X: leftEyeBaseX + (eyeBaseRadius * 1.5),
        point1Y: eyebrowBaseY,
        handle1X: leftEyeBaseX + (eyeBaseRadius * 1.5) - pm.r24,
        handle1Y: sunface.y - pm.r10,
        point2X: sunface.x - pm.r8,
        point2Y: sunface.y + pm.r6,
        handle2X: sunface.x,
        handle2Y: sunface.y + pm.r5,
        point3X: sunface.x + pm.r8,
        point3Y: sunface.y + pm.r6
    },

    mouth: {

        // top lip inner curve
        
        left_outer_anchor_X: mouthBaseX - mouthBaseRadius, 
        left_outer_anchor_Y: mouthBaseY,
        left_inner_anchor_X: mouthBaseX - mouthBaseRadius + pm.r8, 
        left_inner_anchor_Y: mouthBaseY,

        // from left inner
        top_left_inner_cp1_X: mouthBaseX - pm.r8 - pm.r32,
        top_left_inner_cp1_Y: mouthBaseY,
        top_left_inner_cp2_X: mouthBaseX - pm.r16 - pm.r32,
        top_left_inner_cp2_Y: mouthBaseY - pm.r32,

        // middle inner
        top_inner_anchor_X: mouthBaseX,
        top_inner_anchor_Y: mouthBaseY,

        // to right inner
        top_right_inner_cp1_X: mouthBaseX + pm.r8 + pm.r32,
        top_right_inner_cp1_Y: mouthBaseY,
        top_right_inner_cp2_X: mouthBaseX + pm.r16 + pm.r32,
        top_right_inner_cp2_Y: mouthBaseY - pm.r32,

        right_inner_anchor_X: mouthBaseX + mouthBaseRadius - pm.r8, 
        right_inner_anchor_Y: mouthBaseY,
        right_outer_anchor_X: mouthBaseX + mouthBaseRadius, 
        right_outer_anchor_Y: mouthBaseY,

        // top lip outer curve

        // from right
        top_right_outer_cp1_X: mouthBaseX + pm.r8 + pm.r16 - pm.r16,
        top_right_outer_cp1_Y: mouthBaseY + pm.r32 - pm.r32,
        top_right_outer_cp2_X: mouthBaseX + pm.r8 - pm.r16,
        top_right_outer_cp2_Y: mouthBaseY - pm.r16 - pm.r16,

        // top middle outer
        top_outer_anchor_X: mouthBaseX,
        top_outer_anchor_Y: mouthBaseY - pm.r32,

        // to left
        top_left_outer_cp1_X: mouthBaseX - pm.r8 - pm.r16 + pm.r16,
        top_left_outer_cp1_Y: mouthBaseY + pm.r32 - pm.r32,
        top_left_outer_cp2_X: mouthBaseX - pm.r8 + pm.r16,
        top_left_outer_cp2_Y: mouthBaseY - pm.r16 - pm.r16,

    // bottom lip inner curve

        // from left inner curve
        bottom_left_inner_cp1_X: mouthBaseX - pm.r8 - pm.r32,
        bottom_left_inner_cp1_Y: mouthBaseY,
        bottom_left_inner_cp2_X: mouthBaseX - pm.r16 - pm.r32,
        bottom_left_inner_cp2_Y: mouthBaseY - pm.r32,

        // bottom middle inner
        bottom_inner_anchor_X: mouthBaseX,
        bottom_inner_anchor_Y: mouthBaseY,
        
        // to right inner curve
        bottom_right_inner_cp1_X: mouthBaseX + pm.r8 + pm.r32,
        bottom_right_inner_cp1_Y: mouthBaseY,
        bottom_right_inner_cp2_X: mouthBaseX + pm.r16 + pm.r32,
        bottom_right_inner_cp2_Y: mouthBaseY - pm.r32,

        // from right outer curve
        bottom_right_outer_cp1_X: mouthBaseX + pm.r8 + pm.r32,
        bottom_right_outer_cp1_Y: mouthBaseY + pm.r8,
        bottom_right_outer_cp2_X: mouthBaseX + pm.r8,
        bottom_right_outer_cp2_Y: mouthBaseY + ( pm.r8 - pm.r32 ),

        // bottom middle outer
        bottom_outer_anchor_X: mouthBaseX,
        bottom_outer_anchor_Y: mouthBaseY + pm.r8,

        bottom_left_outer_cp1_X: mouthBaseX - pm.r8 - pm.r32,
        bottom_left_outer_cp1_Y: mouthBaseY + pm.r8,
        bottom_left_outer_cp2_X: mouthBaseX - pm.r8,
        bottom_left_outer_cp2_Y: mouthBaseY + ( pm.r8 - pm.r32 )
    },

    teeth: {
        top: {
            lPoint1X: mouthBaseX - pm.r4 - pm.r64,
            lPoint1Y: teethBaseCentreY - pm.r8 - pm.r16,
            lPoint2X: mouthBaseX - pm.r4,
            lPoint2Y: teethBaseCentreY,
            handleX: mouthBaseX,
            handleY: teethBaseCentreY + pm.r32,
            rPoint1X: mouthBaseX + pm.r4,
            rPoint1Y: teethBaseCentreY,
            rPoint2X: mouthBaseX + pm.r4 + pm.r64,
            rPoint2Y: teethBaseCentreY - pm.r8 - pm.r16
        },
        bottom: {
            lPoint1X: mouthBaseX - pm.r4 - pm.r64,
            lPoint1Y: teethBaseCentreY + pm.r8 + pm.r16,
            lPoint2X: mouthBaseX - pm.r4 - pm.r64,
            lPoint2Y: teethBaseCentreY,
            handleX: mouthBaseX,
            handleY: teethBaseCentreY + pm.r32,
            rPoint1X: mouthBaseX + pm.r4 + pm.r64,
            rPoint1Y: teethBaseCentreY,
            rPoint2X: mouthBaseX + pm.r4 + pm.r64,
            rPoint2Y: teethBaseCentreY + pm.r8 + pm.r16
        }
    },

    lip: {
        point1X: mouthBaseX - pm.r8,
        point1Y: mouthBaseY + pm.r8,
        handle1X: mouthBaseX,
        handle1Y: mouthBaseY + pm.r8 + pm.r64,
        point2X: mouthBaseX + pm.r8,
        point2Y: mouthBaseY + pm.r8
    },

    chin: {
        point1X: mouthBaseX - mouthBaseRadius + pm.r8,
        point1Y: mouthBaseY + ( pm.r2 - pm.r16 ),
        handle1X: mouthBaseX,
        handle1Y: mouthBaseY + pm.r2 + pm.r32,
        point2X: mouthBaseX + mouthBaseRadius - pm.r8,
        point2Y: mouthBaseY + ( pm.r2 - pm.r16 )
    },

    innerCheeks: {
        left: {
            tPointX: mouthBaseX - mouthBaseRadius,
            tPointY: mouthBaseY - pm.r4,
            handleX: mouthBaseX - mouthBaseRadius - pm.r8 - pm.r16,
            handleY: mouthBaseY,
            bPointX: mouthBaseX - mouthBaseRadius,
            bPointY: mouthBaseY + pm.r4
        },
        right: {
            tPointX: mouthBaseX + mouthBaseRadius,
            tPointY: mouthBaseY - pm.r4,
            handleX: mouthBaseX + mouthBaseRadius + pm.r8 + pm.r16,
            handleY: mouthBaseY,
            bPointX: mouthBaseX + mouthBaseRadius,
            bPointY: mouthBaseY + pm.r4
        },
    },

    outerCheeks: {
        left: {
            tPointX: sunface.x - pm.r2 - pm.r4 - pm.r8,
            tPointY: sunface.y + pm.r8,
            handleX: sunface.x - ( pm.r2 + pm.r8 ),
            handleY: sunface.y + pm.r8,
            bPointX: sunface.x - pm.r2 - pm.r16,
            bPointY: sunface.y + pm.r2
        },
        right: {
            tPointX: sunface.x + pm.r2 + pm.r4 + pm.r8,
            tPointY: sunface.y + pm.r8,
            handleX: sunface.x + ( pm.r2 + pm.r8 ),
            handleY: sunface.y + pm.r8,
            bPointX: sunface.x + pm.r2 + pm.r16,
            bPointY: sunface.y + pm.r2
        },
    },
    gradients: {
        topLip: {
            top_Y: 0,
            bottom_Y: 0,
            top_opacity: 0,
            bottom_opacity: 0
        },
        bottomLip: {
            top_Y: 0,
            bottom_Y: 0,
            top_opacity: 0,
            bottom_opacity: 0
        },
        teethShadow: {
            r: 221, g: 221, b: 255,
            curr: {
                r: 0, g: 0, b: 0
            }
        }
    }
}


function setBottomTeethCoords() {

    var teeth = baseFaceCoords.teeth.bottom;
    var toothBaselineY = teeth.lPoint2Y + pm.r64;
    var teethWidth = teeth.rPoint2X - teeth.lPoint2X;

    var incisorWidth = ( teethWidth * 0.6 ) / 4;
    var incisorControl = incisorWidth / 2;
    var canineWidth = ( teethWidth * 0.2 ) / 2;
    var canineControl = canineWidth / 2.5;
    var preMolarWidth = ( teethWidth * 0.2 ) / 2;
    var preMolarControl = preMolarWidth;

    teeth.config = {
        incisorWidth: ( teethWidth * 0.6 ) / 4,
        incisorControl: incisorWidth / 2,
        canineWidth: ( teethWidth * 0.2 ) / 2,
        canineControl: canineWidth / 2.5,
        preMolarWidth: ( teethWidth * 0.2 ) / 2,
        preMolarControl: preMolarWidth
    }
}

setBottomTeethCoords();

// clone base face coordinate store for use in animations
var faceCoords = JSON.parse( JSON.stringify( baseFaceCoords ) );


// set up modifier system and connect to proportional measurements
var muscleModifiers = muscleModifier.createModifiers( pm );
muscleModifier.setRangeInputs( muscleModifiers );


// init eye blink track
trackPlayer.loadTrack( 5, 'blink', seq, muscleModifiers );


// expression events

    $( '.expression-smile' ).click( function( e ){
        trackPlayer.loadTrack( 30, 'smile', seq, muscleModifiers );
        trackPlayer.startTrack( 'smile' );
    } );

    $( '.expression-smile-big' ).click( function( e ){
        trackPlayer.loadTrack( 30, 'bigSmile', seq, muscleModifiers );
        trackPlayer.startTrack( 'bigSmile' );
    } );

    $( '.expression-ecstatic' ).click( function( e ){
        trackPlayer.loadTrack( 30, 'ecstatic', seq, muscleModifiers );
        trackPlayer.startTrack( 'ecstatic' );
    } );

    $( '.expression-sad' ).click( function( e ){
        trackPlayer.loadTrack( 60, 'sad', seq, muscleModifiers );
        trackPlayer.startTrack( 'sad' );
    } );

    $( '.expression-very-sad' ).click( function( e ){
        trackPlayer.loadTrack( 60, 'bigSad', seq, muscleModifiers );
        trackPlayer.startTrack( 'bigSad' );
    } );

    $( '.expression-blink' ).click( function( e ){
        trackPlayer.loadTrack( 10, 'blink', seq, muscleModifiers );
        trackPlayer.startTrack( 'blink' );
    } );

    $( '.expression-reset' ).click( function( e ){
        trackPlayer.loadTrack( 10, 'reset', seq, muscleModifiers );
        trackPlayer.startTrack( 'reset' );
    } );


// sequence button events

    $( '.sequence-yawn' ).click( function( e ){
        trackPlayer.loadTrack( 300, 'yawn', seq, muscleModifiers );
        trackPlayer.startTrack( 'yawn' );
    } );


// control panel events
    

    // facial feature panel events
    var $featurePageParent = $( '[ data-page="page-elements" ]');

    var $featureInputs = $featurePageParent.find( '[ data-face ]' );
    $featureInputs.on( 'input', function( e ) {
        var $self = $( this );
        var getModifier = $self.data( 'modifier' );
        var getMultiplier = $self.data( 'value-multiplier' );

        var result = parseFloat( $self.val() * getMultiplier );
        muscleModifiers[ getModifier ].curr = result;
        $self.closest( '.control--panel__item' ).find( 'output' ).html( result );
    } );

    // spike Glare panel events

    let $spikeGlareElParent = $( '.js-glare-spike-effects' );
    let $spikeGlareInputs = $spikeGlareElParent.find( '.range-slider' );
    let spikeGlareControlInputLink = {
        spikeCountInput: 'count',
        spikeRadiusInput: 'r',
        spikeMajorSize: 'majorRayLen',
        spikeMinorSize: 'minorRayLen',
        spikeMajorWidth: 'majorRayWidth',
        spikeMinorWidth: 'minorRayWidth',
        spikeBlurAmount: 'blur'
    }

    $spikeGlareInputs.on( 'input', function( e ) {
        const $self = $( this )[ 0 ];
        
        const thisOpt = spikeGlareControlInputLink[ $self.id ];
        const thisOptCfg = sunSpikes.glareSpikeControlInputCfg[ thisOpt ];
        let $selfVal = parseFloat( $self.value );

        // console.log( '$selfVal: ', $selfVal );
        // console.log( '$self.id: ', $self.id );
        // console.log( 'thisOpt: ', thisOpt );
        // console.log( 'thisOptCfg: ', thisOptCfg );
        // console.log( 'thisOptCfg: ', result );

        sunSpikes.glareSpikeOptions[ thisOpt ] = $selfVal;
        sunSpikes.clearRenderCtx();
        sunSpikes.renderGlareSpikes();
    } );

// look target events
    var $LookTargetInputs = $featurePageParent.find( '.range-slider[ data-control="look" ]' );
    $LookTargetInputs.on( 'input', function( e ) {
        var $self = $( this );
        var getModifier = $self.data( 'modifier' );
        var getMultiplier = $self.data( 'value-multiplier' );
        var thisAxis = getModifier.indexOf( 'X' ) != -1 ? 'x' : getModifier.indexOf( 'Y' ) != -1 ? 'y' : getModifier.indexOf( 'Z' ) != -1 ? 'z' : false;
        // console.log( 'raw value: ', $self.val() );
        // console.log( 'getMultiplier: ', getMultiplier );
        // console.log( 'raw result: ', $self.val() * getMultiplier );

        if ( thisAxis === 'z' ) {
            aimConstraint.setCurrentSize();
        }
        var result = parseFloat( $self.val() * getMultiplier );
        aimConstraint.target.coords.curr[ thisAxis ] = result;
        $self.parent().find( 'output' ).html( result );
        // console.log( 'wrong one firing' );
    } );


function drawOverlay() {

    if ( overlayCfg.displayOverlay ) {
        // draw reference points
        ctx.strokeStyle = sunface.colours.debug.lines;
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 6]);

        if ( overlayCfg.displayCentreLines ) {

            // draw centre lines
            ctx.line(
                sunface.x - ( sunface.r * 2 ), sunface.y,
                sunface.x + ( sunface.r * 2 ), sunface.y
            );


            ctx.line(
                sunface.x, sunface.y - ( sunface.r * 2 ),
                sunface.x, sunface.y + ( sunface.r * 2 )
            );

            ctx.setLineDash( [] );

        }

        if ( overlayCfg.displayLookTarget ) {
            aimConstraint.renderTarget();
        }

        if ( overlayCfg.displaySunToStage ) {
            faceToStageCentreDebugLine( ctx );
        }

        drawMuscleGroups();
    }
}

function computeFaceCoordinates() {

    // store base and current positions of features

    // eyebrows
    var eyebrowL = faceCoords.eyebrows.left;
    var eyebrowR = faceCoords.eyebrows.right;
    var baseEyebrowL = baseFaceCoords.eyebrows.left;
    var baseEyebrowR = baseFaceCoords.eyebrows.right;

    // eyes
    var eyes = faceCoords.eyes;
    var baseEyes = baseFaceCoords.eyes;

    // nose
    var nose = faceCoords.nose;
    var baseNose = baseFaceCoords.nose;

    // mouth
    var mouth = faceCoords.mouth;
    var baseMouth = baseFaceCoords.mouth;
    var lip = faceCoords.lip;
    var baseLip = baseFaceCoords.lip;

    // teeth
    var teethTop = faceCoords.teeth.top;
    var baseTeethTop = baseFaceCoords.teeth.top;
    var teethBottom = faceCoords.teeth.bottom;
    var baseTeethBottom = baseFaceCoords.teeth.bottom;

    // chin
    var chin = faceCoords.chin;
    var baseChin = baseFaceCoords.chin;

    // inner cheeks
    var cheekLeftInner = faceCoords.innerCheeks.left;
    var baseCheekLeftInner = baseFaceCoords.innerCheeks.left;
    var cheekRightInner = faceCoords.innerCheeks.right;
    var baseCheekRightInner = baseFaceCoords.innerCheeks.right;

    // outer cheeks
    var cheekLeftOuter = faceCoords.outerCheeks.left;
    var baseCheekLeftOuter = baseFaceCoords.outerCheeks.left;
    var cheekRightOuter = faceCoords.outerCheeks.right;
    var baseCheekRightOuter = baseFaceCoords.outerCheeks.right;


    // input modifier values
    var leftBrowMod = muscleModifiers.leftEyebrow.curr > 0 ? muscleModifiers.leftEyebrow.curr / 2 : muscleModifiers.leftEyebrow.curr;
    var leftBrowModQtr = leftBrowMod / 4;
    // var rightBrowMod = muscleModifiers.rightEyebrow.curr;
    var rightBrowMod = muscleModifiers.rightEyebrow.curr > 0 ? muscleModifiers.rightEyebrow.curr / 2 : muscleModifiers.rightEyebrow.curr;
    var rightBrowModQtr = rightBrowMod / 4;

    var leftBrowIndexEased = 1;
    var leftBrowModIndex = muscleModifiers.leftEyebrow.curr / muscleModifiers.leftEyebrow.min;

    if ( muscleModifiers.leftEyebrow.curr > 0 ) {
        leftBrowIndexEased = 1;
    } else {
        leftBrowIndexEased = easing.linearEase( leftBrowModIndex, 1, -1, 1 );
    }
    var leftBrowIndexEasedReverse = 1 - leftBrowIndexEased;
    var leftBrowModIndexReverse = 1 - leftBrowModIndex;



    var rightBrowIndexEased = 1;
    var rightBrowModIndex = muscleModifiers.rightEyebrow.curr / muscleModifiers.rightEyebrow.min;

    if ( muscleModifiers.rightEyebrow.curr > 0 ) {
        rightBrowIndexEased = 1;
    } else {
        rightBrowIndexEased = easing.linearEase( rightBrowModIndex, 1, -1, 1 );
    }
    var rightBrowIndexEasedReverse = 1 - rightBrowIndexEased;
    var rightBrowModIndexReverse = 1 - rightBrowModIndex;



    var leftBrowContractMod = muscleModifiers.leftBrowContract.curr;
    var leftBrowContractModIndex = leftBrowContractMod / muscleModifiers.leftBrowContract.max;
    var rightBrowContractMod = muscleModifiers.rightBrowContract.curr;
    var rightBrowContractModIndex = rightBrowContractMod / muscleModifiers.rightBrowContract.max;
    // console.log( 'leftBrowContractMod: ', leftBrowContractMod );
    // console.log( 'rightBrowContractMod: ', rightBrowContractMod );




    var leftEyeMod = muscleModifiers.leftEye.curr;
    var rightEyeMod = muscleModifiers.rightEye.curr;

    var nostrilLeftRaise = muscleModifiers.nostrilRaiseL.curr;
    var nostrilRightRaise = muscleModifiers.nostrilRaiseR.curr;

    var nostrilLeftFlare = muscleModifiers.nostrilFlareL.curr;
    var nostrilRightFlare = muscleModifiers.nostrilFlareR.curr;

    var leftCheekMod = muscleModifiers.leftCheek.curr;
    var rightCheekMod = muscleModifiers.rightCheek.curr;

    var mouthEdgeLeft = muscleModifiers.mouthEdgeLeft.curr;
    var mouthEdgeLeftIndex = mouthEdgeLeft / muscleModifiers.mouthEdgeLeft.max;
    var mouthEdgeLeftReverseIndex = 1 - mouthEdgeLeftIndex;
    var mouthEdgeRight = muscleModifiers.mouthEdgeRight.curr;
    var mouthEdgeRightIndex = mouthEdgeRight / muscleModifiers.mouthEdgeRight.max;
    var mouthEdgeRightReverseIndex = 1 - mouthEdgeRightIndex;

    var mouthEdgeLeftExtend = muscleModifiers.mouthEdgeLeftExtend.curr;
    var mouthEdgeRightExtend = muscleModifiers.mouthEdgeRightExtend.curr; 

    var topLipLeftPull = muscleModifiers.topLipLeftPull.curr;
    var topLipRightPull = muscleModifiers.topLipRightPull.curr;

    var bottomLipLeftPull = muscleModifiers.bottomLipLeftPull.curr;
    var bottomLipLeftPullIndex = bottomLipLeftPull / muscleModifiers.bottomLipLeftPull.max;
    var bottomLipLeftPullReverseIndex = 1 - bottomLipLeftPullIndex;
    var bottomLipRightPull = muscleModifiers.bottomLipRightPull.curr;
    var bottomLipRightPullIndex = bottomLipRightPull / muscleModifiers.bottomLipRightPull.max;
    var bottomLipRightPullReverseIndex = 1 - bottomLipRightPullIndex;

    var topLipOpenMod = muscleModifiers.topLipOpen.curr;
    var topLipOpenMin = muscleModifiers.topLipOpen.min;
    var topLipOpenMax = muscleModifiers.topLipOpen.max;
    var topLipChangeDelta = topLipOpenMax - topLipOpenMin;

    var topLipOpenIndex = topLipOpenMod / topLipOpenMax;
    var topLipOpenReverseIndex = 1 - topLipOpenIndex;

    var topLipLeftPullNormalised = ( topLipLeftPull * topLipOpenReverseIndex ) * 1.2;
    var topLipRightPullNormalised = ( topLipRightPull * topLipOpenReverseIndex ) * 1.2;

    // topLip eased move, using easing functions
    var topLipOpenEased = easing.easeInQuint( topLipOpenMod, topLipOpenMin, topLipChangeDelta, topLipOpenMax );

    var bottomLipOpenMod = muscleModifiers.bottomLipOpen.curr;

    var lipsPucker = muscleModifiers.lipsPucker.curr;
    var lipsPuckerMin = muscleModifiers.lipsPucker.min;
    var lipsPuckerMax = muscleModifiers.lipsPucker.max;



    var jawOpen = muscleModifiers.jawOpen.curr;
    var jawIndex = muscleModifiers.jawOpen.curr / muscleModifiers.jawOpen.max;
    var jawReverseIndex = 1 - jawIndex;

    var jawLateral = muscleModifiers.jawLateral.curr;

    // muscle modifications

    // eyebrows
    ///////////*****************************/////////////
    eyebrowL.handle1Y = baseEyebrowL.handle1Y + leftBrowMod;
    eyebrowL.handle2Y = baseEyebrowL.handle2Y + leftBrowMod;
    eyebrowL.lPointY = baseEyebrowL.lPointY + leftBrowMod * 0.25;
    eyebrowL.rPointY = baseEyebrowL.rPointY + leftBrowMod;

    eyebrowR.handle1Y = baseEyebrowR.handle1Y + rightBrowMod;
    eyebrowR.handle2Y = baseEyebrowR.handle2Y + rightBrowMod;
    eyebrowR.lPointY = baseEyebrowR.lPointY + rightBrowMod;
    eyebrowR.rPointY = baseEyebrowR.rPointY + rightBrowMod * 0.25;
    
    nose.point1Y = baseNose.point1Y + ( ( leftBrowMod + rightBrowMod ) / 2 );

    eyes.left.tHandleY = baseEyes.left.tHandleY + leftBrowModQtr;
    eyes.right.tHandleY = baseEyes.right.tHandleY + rightBrowModQtr;


    // forhead modifications
    ///////////*****************************/////////////

    eyebrowL.rPointX = baseEyebrowL.rPointX + leftBrowContractMod;
    eyebrowL.handle1X = baseEyebrowL.handle1X + leftBrowContractMod * 2;
    eyebrowL.handle2X = baseEyebrowL.handle2X + leftBrowContractMod * 2;

    eyebrowL.handle1Y -= ( ( leftBrowContractMod * 3 ) * leftBrowIndexEased );
    eyebrowL.handle2Y += ( leftBrowContractMod * 7 ) + ( ( -20 * leftBrowContractModIndex ) * leftBrowIndexEasedReverse );
    eyebrowL.rPointY -= ( leftBrowContractMod * 3 ) + ( ( 20 * leftBrowContractModIndex ) * leftBrowIndexEasedReverse );


    eyebrowR.lPointX = baseEyebrowR.lPointX - rightBrowContractMod;
    eyebrowR.handle1X = baseEyebrowR.handle1X - rightBrowContractMod * 2;
    eyebrowR.handle2X = baseEyebrowR.handle2X - rightBrowContractMod * 2;

    eyebrowR.handle2Y -= ( ( rightBrowContractMod * 3 ) * rightBrowIndexEased );
    eyebrowR.handle1Y += ( rightBrowContractMod * 7 ) + ( ( -20 * rightBrowContractModIndex ) * rightBrowIndexEasedReverse );
    eyebrowR.lPointY -= ( rightBrowContractMod * 3 ) + ( ( 20 * rightBrowContractModIndex ) * rightBrowIndexEasedReverse );


    // nose modifications from forehead ( indirect )
    ///////////*****************************/////////////
    nose.point1X = baseNose.point1X + ( ( leftBrowContractMod + rightBrowContractMod ) / 2 );

    eyes.left.bHandleY = baseEyes.left.bHandleY + leftCheekMod * 0.4;
    eyes.right.bHandleY = baseEyes.right.bHandleY + rightCheekMod * 0.4;

    // eyes mod
    var leftEyeDist = eyes.left.bHandleY - eyes.left.tHandleY;
    eyes.left.tHandleY = eyes.left.bHandleY - ( leftEyeDist * leftEyeMod );

    var rightEyeDist = eyes.right.bHandleY - eyes.right.tHandleY;
    eyes.right.tHandleY = eyes.right.bHandleY - ( rightEyeDist * rightEyeMod );

    

    // mouth ( very, VERY complicated )
    ///////////*****************************///////////// 

    // width
    mouth.left_outer_anchor_X = baseMouth.left_outer_anchor_X + mouthEdgeLeft + ( jawOpen * 0.2 );
    mouth.left_inner_anchor_X = baseMouth.left_inner_anchor_X + mouthEdgeLeft + ( jawOpen * 0.2 );
    mouth.right_outer_anchor_X = baseMouth.right_outer_anchor_X + mouthEdgeRight - ( jawOpen * 0.2 );
    mouth.right_inner_anchor_X = baseMouth.right_inner_anchor_X + mouthEdgeRight - ( jawOpen * 0.2 );

    let lipCentreXAveraged = mouth.left_inner_anchor_X + ( ( mouth.right_inner_anchor_X - mouth.left_inner_anchor_X ) / 2 );
    let lipCentreOffsetX = ( lipCentreXAveraged -  baseMouth.top_inner_anchor_X ) * 1.5;

    mouth.top_inner_anchor_X = lipCentreXAveraged;
    mouth.top_outer_anchor_X = lipCentreXAveraged;
    mouth.bottom_inner_anchor_X = baseMouth.bottom_inner_anchor_X;
    mouth.bottom_outer_anchor_X = baseMouth.bottom_outer_anchor_X;

    mouth.bottom_inner_anchor_X += lipCentreOffsetX;
    mouth.bottom_outer_anchor_X += lipCentreOffsetX;


    let topLipMax = pm.r16 + pm.r32 + pm.r64;
    let topLeftInnerCP1Change = topLipOpenEased + topLipLeftPull < topLipMax ? topLipOpenEased + topLipLeftPull : topLipMax;
    let topLeftInnerCP2Change = topLipOpenMod + ( topLipLeftPull * 0.5 ) < topLipMax ? topLipOpenMod + ( topLipLeftPull * 0.5 ) : topLipMax;

    let topRightInnerCP1Change = topLipOpenEased + topLipRightPull < topLipMax ? topLipOpenEased + topLipRightPull : topLipMax;;
    let topRightInnerCP2Change = topLipOpenMod + ( topLipRightPull * 0.5 ) < topLipMax ? topLipOpenMod + ( topLipRightPull * 0.5 ) : topLipMax;

    let topLipCentreMax = pm.r16 + pm.r32 + pm.r64;
    let topLipCentreAnchorNormalise = ( topLipLeftPull + topLipRightPull ) / 2;

    let topLipInnerCentreChange = ( topLipOpenMod * 1.1 ) + topLipCentreAnchorNormalise < topLipCentreMax ? ( topLipOpenMod * 1.1 ) + topLipCentreAnchorNormalise : topLipCentreMax;
    let topLipOuterCentreChange = ( topLipOpenMod * 1.3 ) + topLipCentreAnchorNormalise < topLipCentreMax ? ( topLipOpenMod * 1.3 ) + topLipCentreAnchorNormalise : topLipCentreMax;
    let cheeksNormalised = ( ( leftCheekMod + rightCheekMod ) / 2 );

    mouth.top_left_inner_cp1_Y = baseMouth.top_left_inner_cp1_Y + ( leftCheekMod * 0.3 ) - topLeftInnerCP1Change;
    mouth.top_left_inner_cp2_Y = baseMouth.top_left_inner_cp2_Y + ( leftCheekMod * 0.2 ) - topLeftInnerCP2Change;
    mouth.top_left_outer_cp1_Y = baseMouth.top_left_outer_cp1_Y + ( leftCheekMod * 0.3 ) - topLeftInnerCP1Change;
    mouth.top_left_outer_cp2_Y = baseMouth.top_left_outer_cp2_Y + ( leftCheekMod * 0.2 ) - topLeftInnerCP2Change;

    mouth.top_right_inner_cp1_Y = baseMouth.top_right_inner_cp1_Y + ( rightCheekMod * 0.3 ) - topRightInnerCP1Change;
    mouth.top_right_inner_cp2_Y = baseMouth.top_right_inner_cp2_Y + ( rightCheekMod * 0.2 ) - topRightInnerCP2Change;
    mouth.top_right_outer_cp1_Y = baseMouth.top_right_outer_cp1_Y + ( rightCheekMod * 0.3 ) - topRightInnerCP1Change;
    mouth.top_right_outer_cp2_Y = baseMouth.top_right_outer_cp2_Y + ( rightCheekMod * 0.2 ) - topRightInnerCP2Change;

    mouth.top_inner_anchor_Y = baseMouth.top_inner_anchor_Y + ( cheeksNormalised * 0.3 ) - topLipInnerCentreChange;
    mouth.top_outer_anchor_Y = baseMouth.top_outer_anchor_Y + ( cheeksNormalised * 0.3 ) - topLipOuterCentreChange;

    if ( lipCentreOffsetX < 0 ) {

        mouth.top_left_inner_cp1_X = baseMouth.top_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_left_inner_cp2_X = baseMouth.top_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_left_outer_cp1_X = baseMouth.top_left_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.top_left_outer_cp2_X = baseMouth.top_left_outer_cp2_X + ( lipCentreOffsetX );
        mouth.top_right_inner_cp1_X = baseMouth.top_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_right_inner_cp2_X = baseMouth.top_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_right_outer_cp1_X = baseMouth.top_right_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.top_right_outer_cp2_X = baseMouth.top_right_outer_cp2_X + ( lipCentreOffsetX );

        mouth.bottom_left_inner_cp1_X = baseMouth.bottom_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_left_inner_cp2_X = baseMouth.bottom_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_left_outer_cp1_X = baseMouth.bottom_left_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.bottom_left_outer_cp2_X = baseMouth.bottom_left_outer_cp2_X + ( lipCentreOffsetX );
        mouth.bottom_right_inner_cp1_X = baseMouth.bottom_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_right_inner_cp2_X = baseMouth.bottom_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_right_outer_cp1_X = baseMouth.bottom_right_outer_cp1_X + ( lipCentreOffsetX * 0.7 );
        mouth.bottom_right_outer_cp2_X = baseMouth.bottom_right_outer_cp2_X + ( lipCentreOffsetX );

    } else {
        mouth.top_left_inner_cp1_X = baseMouth.top_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_left_inner_cp2_X = baseMouth.top_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_left_outer_cp1_X = baseMouth.top_left_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_left_outer_cp2_X = baseMouth.top_left_outer_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_right_inner_cp1_X = baseMouth.top_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_right_inner_cp2_X = baseMouth.top_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.top_right_outer_cp1_X = baseMouth.top_right_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.top_right_outer_cp2_X = baseMouth.top_right_outer_cp2_X + ( lipCentreOffsetX * 0.8 );

        mouth.bottom_left_inner_cp1_X = baseMouth.bottom_left_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_left_inner_cp2_X = baseMouth.bottom_left_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_left_outer_cp1_X = baseMouth.bottom_left_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_left_outer_cp2_X = baseMouth.bottom_left_outer_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_right_inner_cp1_X = baseMouth.bottom_right_inner_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_right_inner_cp2_X = baseMouth.bottom_right_inner_cp2_X + ( lipCentreOffsetX * 0.8 );
        mouth.bottom_right_outer_cp1_X = baseMouth.bottom_right_outer_cp1_X + ( lipCentreOffsetX * 0.5 );
        mouth.bottom_right_outer_cp2_X = baseMouth.bottom_right_outer_cp2_X + ( lipCentreOffsetX * 0.8 );
    }


    mouth.top_left_inner_cp1_X -= ( topLipOpenMod * 0.3 ) + topLipLeftPull;
    mouth.top_left_inner_cp2_X -= ( topLipOpenMod * 0.2 ) + ( topLipLeftPull * 0.2 );
    mouth.top_left_outer_cp1_X -= topLipOpenMod + topLipLeftPull;
    mouth.top_left_outer_cp2_X -= ( topLipOpenMod * 0.2 ) + ( topLipLeftPull * 0.5 );

    mouth.top_left_inner_cp1_X -= ( jawOpen * 0.3 );
    mouth.top_left_outer_cp1_X -= ( jawOpen * 0.3 );
    mouth.top_left_outer_cp2_X -= ( jawOpen * 0.2 );

    mouth.top_right_inner_cp1_X += ( topLipOpenMod * 0.3 ) + topLipRightPull;
    mouth.top_right_inner_cp2_X += ( topLipOpenMod * 0.2 ) + ( topLipRightPull * 0.2 );
    mouth.top_right_outer_cp1_X += topLipOpenMod + topLipRightPull;
    mouth.top_right_outer_cp2_X += ( topLipOpenMod * 0.2 ) + ( topLipRightPull * 0.5 );

    mouth.top_right_inner_cp1_X += ( jawOpen * 0.3 );
    mouth.top_right_outer_cp1_X += ( jawOpen * 0.3 );
    mouth.top_right_outer_cp2_X += ( jawOpen * 0.2 );

    mouth.top_outer_anchor_Y -= jawOpen * 0.05;

    

    mouth.bottom_left_inner_cp1_Y = baseMouth.bottom_left_inner_cp1_Y + ( leftCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_left_inner_cp2_Y = baseMouth.bottom_left_inner_cp2_Y + ( leftCheekMod * 0.2 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );
    mouth.bottom_right_inner_cp1_Y = baseMouth.bottom_right_inner_cp1_Y + ( rightCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_right_inner_cp2_Y = baseMouth.bottom_right_inner_cp2_Y + ( rightCheekMod * 0.2 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );

    // mouth.bottom_inner_anchor_Y = baseMouth.bottom_inner_anchor_Y + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );
    // mouth.bottom_outer_anchor_Y = baseMouth.bottom_outer_anchor_Y + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );

    mouth.bottom_left_outer_cp1_Y = baseMouth.bottom_left_outer_cp1_Y + ( leftCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_left_outer_cp2_Y = baseMouth.bottom_left_outer_cp2_Y + ( leftCheekMod * 0.2 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 );
    mouth.bottom_right_outer_cp1_Y = baseMouth.bottom_right_outer_cp1_Y + ( rightCheekMod * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.9 );
    mouth.bottom_right_outer_cp2_Y = baseMouth.bottom_right_outer_cp2_Y + ( rightCheekMod * 0.2 ) + ( jawOpen * 0.8 ) +  ( bottomLipOpenMod * 0.8 );

    let bottomLipCentreAnchorNormalise = ( mouth.bottom_left_inner_cp2_Y - mouth.bottom_right_inner_cp2_Y ) / 2;

    mouth.bottom_inner_anchor_Y = baseMouth.bottom_inner_anchor_Y + ( cheeksNormalised * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 ) + bottomLipCentreAnchorNormalise;
    mouth.bottom_outer_anchor_Y = baseMouth.bottom_outer_anchor_Y + ( cheeksNormalised * 0.3 ) + ( jawOpen * 0.8 ) + ( bottomLipOpenMod * 0.8 ) + bottomLipCentreAnchorNormalise;


    mouth.bottom_left_inner_cp1_Y += ( ( bottomLipLeftPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_left_inner_cp2_Y += ( ( bottomLipLeftPull * 0.5 ) * jawReverseIndex );
    mouth.bottom_left_outer_cp1_Y += ( ( bottomLipLeftPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_left_outer_cp2_Y += ( ( bottomLipLeftPull * 0.5 ) * jawReverseIndex );

    mouth.bottom_right_inner_cp1_Y += ( ( bottomLipRightPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_right_inner_cp2_Y += ( ( bottomLipRightPull * 0.5 ) * jawReverseIndex );
    mouth.bottom_right_outer_cp1_Y += ( ( bottomLipRightPull * 0.7 ) * jawReverseIndex );
    mouth.bottom_right_outer_cp2_Y += ( ( bottomLipRightPull * 0.5 ) * jawReverseIndex );


    mouth.bottom_left_inner_cp1_X -= ( bottomLipLeftPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_left_inner_cp2_X -= ( bottomLipLeftPull * 0.5 );
    mouth.bottom_left_outer_cp1_X -= ( bottomLipLeftPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_left_outer_cp2_X -= ( bottomLipLeftPull * 0.5 );

    mouth.bottom_right_inner_cp1_X += ( bottomLipRightPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_right_inner_cp2_X += ( bottomLipRightPull * 0.5 );
    mouth.bottom_right_outer_cp1_X += ( bottomLipRightPull * ( 1.3 + ( 0.6 * jawReverseIndex ) ) );
    mouth.bottom_right_outer_cp2_X += ( bottomLipRightPull * 0.5 );


    // compute curve end points after control points to average out curves in the mouth
    // stops resulting mouth shape looking like an extreme figure of eight
    var lipEdgePartingMax = pm.r16 + pm.r32 + pm.r64;
    var lipMaxIterations = 80;
    var leftLipEdgeParting = 0;
    var leftInnerLipDist = mouth.bottom_left_inner_cp1_Y - mouth.top_left_inner_cp1_Y;
    let leftInnerLipDistWeighted = leftInnerLipDist * 0.1;
    let leftEdgeCtrlPOffset = ( mouth.left_inner_anchor_X - ( mouth.top_left_inner_cp1_X + mouth.bottom_left_inner_cp1_X ) / 2 ) / 2;
    // console.log( 'mouth.bottom_left_inner_cp1_Y - mouth.top_left_inner_cp1_Y: ', mouth.bottom_left_inner_cp1_Y - mouth.top_left_inner_cp1_Y );
    if ( leftInnerLipDist === 0 ) {
        leftLipEdgeParting = 0;
    } else {
        if ( leftInnerLipDist > lipMaxIterations ) {
            leftLipEdgeParting = lipEdgePartingMax;
        } else {
            leftLipEdgeParting = easing.easeOutQuart( leftInnerLipDist, 0, lipEdgePartingMax, lipMaxIterations );
        }
    }
    mouth.left_outer_anchor_X -= leftEdgeCtrlPOffset;
    mouth.left_inner_anchor_X -= leftEdgeCtrlPOffset;
    mouth.left_inner_anchor_X -= leftLipEdgeParting;

    var rightLipEdgeParting = 0;
    var rightInnerLipDist = mouth.bottom_right_inner_cp1_Y - mouth.top_right_inner_cp1_Y;
    let rightInnerLipDistWeighted = rightInnerLipDist * 0.1;
    let rightEdgeCtrlPOffset = ( mouth.right_inner_anchor_X - ( mouth.top_right_inner_cp1_X + mouth.bottom_right_inner_cp1_X ) / 2 ) / 2;

    if ( rightInnerLipDist === 0 ) {
        rightLipEdgeParting = 0;
    } else {
        if ( rightInnerLipDist > lipMaxIterations ) {
            rightLipEdgeParting = lipEdgePartingMax;
        } else {
            rightLipEdgeParting = easing.easeOutQuart( rightInnerLipDist, 0, lipEdgePartingMax, lipMaxIterations );
        }
    }
    mouth.right_inner_anchor_X -= rightEdgeCtrlPOffset;
    mouth.right_outer_anchor_X -= rightEdgeCtrlPOffset;
    mouth.right_inner_anchor_X += rightLipEdgeParting;

    let leftCheekMouthEdgeInfluence = leftCheekMod < 0 ? 0.4 : 0.1;
    let rightCheekMouthEdgeInfluence = rightCheekMod < 0 ? 0.4 : 0.1;
    mouth.left_outer_anchor_Y = baseMouth.left_outer_anchor_Y + ( leftCheekMod * leftCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 )  + ( ( leftInnerLipDistWeighted * bottomLipLeftPullIndex ) * jawIndex);
    mouth.left_inner_anchor_Y = baseMouth.left_inner_anchor_Y + ( leftCheekMod * leftCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 )  + ( ( leftInnerLipDistWeighted * bottomLipLeftPullIndex ) * jawIndex);
    mouth.right_outer_anchor_Y = baseMouth.right_outer_anchor_Y + ( rightCheekMod * rightCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 ) + ( ( rightInnerLipDistWeighted * bottomLipRightPullIndex ) * jawIndex);
    mouth.right_inner_anchor_Y = baseMouth.right_inner_anchor_Y + ( rightCheekMod * rightCheekMouthEdgeInfluence ) + ( jawOpen * 0.25 ) + ( ( rightInnerLipDistWeighted * bottomLipRightPullIndex ) * jawIndex );

    let mouthEdgeLeftExtendAbsolute = mouthEdgeLeftExtend <= 0 ? mouthEdgeLeftExtend * -1 : mouthEdgeLeftExtend;
    let mouthEdgeRightExtendAbsolute = mouthEdgeRightExtend <= 0 ? mouthEdgeRightExtend * -1 : mouthEdgeRightExtend;

    mouth.left_inner_anchor_Y += mouthEdgeLeftExtend * 0.3;
    mouth.left_inner_anchor_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.left_outer_anchor_Y += mouthEdgeLeftExtend * 0.7;
    

    mouth.top_left_inner_cp1_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.bottom_left_inner_cp1_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.top_left_inner_cp2_X -= mouthEdgeLeftExtendAbsolute * 0.3;
    mouth.bottom_left_inner_cp2_X -= mouthEdgeLeftExtendAbsolute * 0.3;

    mouth.top_left_outer_cp1_X -= mouthEdgeLeftExtendAbsolute * 0.3;

    mouth.right_inner_anchor_Y += mouthEdgeRightExtend * 0.3;
    mouth.right_inner_anchor_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.right_outer_anchor_Y += mouthEdgeRightExtend * 0.7;

    mouth.top_right_outer_cp1_X += mouthEdgeRightExtendAbsolute * 0.3;

    mouth.top_right_inner_cp1_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.bottom_right_inner_cp1_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.top_right_inner_cp2_X += mouthEdgeRightExtendAbsolute * 0.3;
    mouth.bottom_right_inner_cp2_X += mouthEdgeRightExtendAbsolute * 0.3;

    if ( mouthEdgeLeftExtend > 0 && mouthEdgeRightExtend > 0 ) {
        mouth.bottom_outer_anchor_Y -= ( mouthEdgeLeftExtend + mouthEdgeRightExtend ) / 2;
    }
    


    mouth.top_left_outer_cp1_X += ( lipsPucker * 0.6 ) * jawReverseIndex;
    // mouth.top_left_outer_cp1_Y -= lipsPucker * 0.4;
    mouth.top_left_outer_cp2_X -= ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.top_left_outer_cp2_Y -= ( lipsPucker * 0.4 ) * jawReverseIndex;

    mouth.top_outer_anchor_Y -= ( lipsPucker * 0.4 ) * jawReverseIndex;

    mouth.top_right_outer_cp1_X -= ( lipsPucker * 0.6 ) * jawReverseIndex;
    // mouth.top_right_outer_cp1_Y -= lipsPucker * 0.4;
    mouth.top_right_outer_cp2_X += ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.top_right_outer_cp2_Y -= ( lipsPucker * 0.4 ) * jawReverseIndex;

    mouth.bottom_left_outer_cp1_X += ( lipsPucker ) * jawReverseIndex;
    mouth.bottom_left_outer_cp1_Y -= ( lipsPucker * 0.6 ) * jawReverseIndex;
    mouth.bottom_left_outer_cp2_X -= ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.bottom_left_outer_cp2_Y += ( lipsPucker * 0.3 ) * jawReverseIndex;

    mouth.bottom_right_outer_cp1_X -= ( lipsPucker ) * jawReverseIndex;
    mouth.bottom_right_outer_cp1_Y -= ( lipsPucker * 0.6 ) * jawReverseIndex;
    mouth.bottom_right_outer_cp2_X += ( lipsPucker * 1.4 ) * jawReverseIndex;
    mouth.bottom_right_outer_cp2_Y += ( lipsPucker * 0.3 ) * jawReverseIndex;


    var mouthGradientsTop = faceCoords.gradients.topLip;
    var mouthGradientsBottom = faceCoords.gradients.bottomLip;

    mouthGradientsTop.top_Y = mouth.left_inner_anchor_Y - pm.r16;
    mouthGradientsTop.bottom_Y = mouth.left_inner_anchor_Y;
    // mouthGradientsTop.top_opacity = 0.2 * jawIndex;
    // mouthGradientsTop.bottom_opacity = 1 - ( 0.4 * jawIndex );
    mouthGradientsTop.top_opacity = 0.2 - ( 0.2 * jawIndex );
    mouthGradientsTop.bottom_opacity = 1 - ( 0.3 * jawIndex );
    mouthGradientsBottom.top_Y = mouth.bottom_inner_anchor_Y;
    mouthGradientsBottom.bottom_Y = mouth.bottom_outer_anchor_Y;
    mouthGradientsTop.top_opacity = 0.4 - ( 0.2 * jawIndex );
    mouthGradientsTop.bottom_opacity = 0.2;

    let jawColModifier = jawIndex > 0.5 ? 1 : jawIndex * 2;
    let teethShadowColour = faceCoords.gradients.teethShadow;
    teethShadowColour.curr.r =  ( ( teethShadowColour.r / 4 ) * 3 ) + ( ( teethShadowColour.r / 4 ) * jawColModifier );
    teethShadowColour.curr.g = ( ( teethShadowColour.g / 4 ) * 3 ) + ( ( teethShadowColour.g / 4 ) * jawColModifier );
    teethShadowColour.curr.b = ( ( teethShadowColour.b / 4 ) * 3 ) + ( ( teethShadowColour.b / 4 ) * jawColModifier );

    // nose
    ///////////*****************************/////////////
    nose.point2Y = baseNose.point2Y + nostrilLeftRaise;
    nose.point3Y = baseNose.point3Y + nostrilRightRaise;

    nose.point2X = baseNose.point2X + ( lipCentreOffsetX * 0.5 ) - nostrilLeftFlare;
    nose.handle2X = baseNose.handle2X + ( lipCentreOffsetX * 0.5 );
    nose.point3X = baseNose.point3X + ( lipCentreOffsetX * 0.5 ) + nostrilRightFlare;


    // lip line
    ///////////*****************************/////////////
    lip.point1X = baseLip.point1X + lipCentreOffsetX + ( jawLateral * 0.6 );
    lip.handle1X = baseLip.handle1X + lipCentreOffsetX + ( jawLateral * 0.6 );
    lip.point2X = baseLip.point2X + lipCentreOffsetX + ( jawLateral * 0.6 );

    lip.point1Y = baseLip.point1Y + ( leftCheekMod * 0.3 ) + nostrilRightRaise;
    lip.handle1Y = baseLip.handle1Y + cheeksNormalised;
    lip.point2Y = baseLip.point2Y + ( rightCheekMod * 0.3 ) + nostrilRightRaise;

    lip.point1Y += ( bottomLipOpenMod + ( jawOpen * 0.85 ) );
    lip.handle1Y += ( bottomLipOpenMod + ( jawOpen * 0.85 ) );
    lip.point2Y += ( bottomLipOpenMod + ( jawOpen * 0.85 ) );

    lip.point1Y -= ( lipsPucker * 0.5 );
    lip.point2Y -= ( lipsPucker * 0.5 );

    // cheeks
    ///////////*****************************/////////////
    cheekLeftInner.tPointY = baseCheekLeftInner.tPointY;
    cheekRightInner.tPointY = baseCheekRightInner.tPointY;

    cheekLeftInner.bPointY = baseCheekLeftInner.bPointY + ( jawOpen * 0.5 );
    cheekRightInner.bPointY = baseCheekRightInner.bPointY + ( jawOpen * 0.5 );

    cheekLeftInner.bPointX = baseCheekLeftInner.bPointX + ( jawLateral * 0.5 );
    cheekRightInner.bPointX = baseCheekRightInner.bPointX + ( jawLateral * 0.5 );

    cheekLeftInner.handleY = baseCheekLeftInner.handleY + ( leftCheekMod * 0.4 ) + mouthEdgeLeftExtend;
    cheekRightInner.handleY = baseCheekRightInner.handleY + ( rightCheekMod * 0.4 ) + mouthEdgeRightExtend;


    cheekLeftInner.handleX = baseCheekLeftInner.handleX + mouthEdgeLeft + ( mouthEdgeLeftExtend * 0.7);
    cheekRightInner.handleX = baseCheekRightInner.handleX + mouthEdgeRight - ( mouthEdgeRightExtend * 0.7);

    cheekLeftInner.handleX += ( lipsPucker * 1.5 );
    cheekRightInner.handleX -= ( lipsPucker * 1.5 );

    cheekLeftOuter.handleY = baseCheekLeftOuter.handleY + ( leftCheekMod * 0.4 );
    cheekRightOuter.handleY = baseCheekRightOuter.handleY + ( rightCheekMod * 0.4 );

    cheekLeftOuter.bPointY = baseCheekLeftOuter.bPointY + ( jawOpen * 0.3 );
    cheekRightOuter.bPointY = baseCheekRightOuter.bPointY + ( jawOpen * 0.3 );

    cheekLeftOuter.bPointX = baseCheekLeftOuter.bPointX + ( jawLateral * 0.3 );
    cheekRightOuter.bPointX = baseCheekRightOuter.bPointX + ( jawLateral * 0.3 );

    ///////////*****************************/////////////

    
    // // mouth openess
    teethBottom.lPoint1Y = baseTeethBottom.lPoint1Y + ( jawOpen * 0.95 );
    teethBottom.lPoint2Y = baseTeethBottom.lPoint2Y + ( jawOpen * 0.95 );
    teethBottom.handleY = baseTeethBottom.handleY + ( jawOpen * 0.95 );
    teethBottom.rPoint1Y = baseTeethBottom.rPoint1Y + ( jawOpen * 0.95 );
    teethBottom.rPoint2Y = baseTeethBottom.rPoint2Y + ( jawOpen * 0.95 );

    chin.point1Y = baseChin.point1Y + ( jawOpen * 0.2 );
    chin.handle1Y = baseChin.handle1Y + ( jawOpen * 0.2 );
    chin.point2Y = baseChin.point2Y + ( jawOpen * 0.2 );

    chin.point1X = baseChin.point1X + ( jawLateral * 0.2 );
    chin.handle1X = baseChin.handle1X + ( jawLateral * 0.2 );
    chin.point2X = baseChin.point2X + ( jawLateral * 0.2 );


    // jaw sideways movement
    teethBottom.lPoint1X = baseTeethBottom.lPoint1X + ( jawLateral * 0.35 );
    teethBottom.lPoint2X = baseTeethBottom.lPoint2X + ( jawLateral * 0.35 );
    teethBottom.handleX = baseTeethBottom.handleX + ( jawLateral * 0.35 );
    teethBottom.rPoint1X = baseTeethBottom.rPoint1X + ( jawLateral * 0.35 );
    teethBottom.rPoint2X = baseTeethBottom.rPoint2X + ( jawLateral * 0.35 );
}



// sunSpikes.displayGlareSpikesRandom();

function drawFace() {

    computeFaceCoordinates();
    aimConstraint.computeTargetAngles();

    ctx.fillStyle = 'rgba( 255, 255, 100, 1 )';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
    // coronaLayerCtx.globalCompositeOperation = 'source-over';
    // sunSpikes.displayCorona();
    

    // var renderFlares = sunSpikes.displayCfg.flares;

    // coronaLayerCtx.drawImage(
    //     sunSpikes.flareOptions.canvas,
    //     renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
    //     sunface.x - (renderFlares.w / 2 ), sunface.y - (renderFlares.h / 2 ), renderFlares.w, renderFlares.h
    // );    

    // coronaLayerCtx.globalCompositeOperation = 'lighter';

    // var renderGlare = sunSpikes.displayCfg.glareSpikesRandom.render;

    // coronaLayerCtx.drawImage(
    //     sunSpikes.renderCfg.canvas,
    //     renderGlare.x, renderGlare.y, renderGlare.w, renderGlare.h,
    //     sunface.x - (renderGlare.w / 2 ), sunface.y - (renderGlare.h / 2 ), renderGlare.w, renderGlare.h
    // );

    

    // spikes
    // sunSpikes.render( sunface.x, sunface.y, staticAssetConfigs.sunSpike, ctx );

    ////////////////////////////////////////////
    // coronaLayerCtx.globalCompositeOperation = 'source-over';

    // var renderFlares = sunSpikes.displayCfg.flares;

    // coronaLayerCtx.drawImage(
    //     renderFlares.canvas,
    //     renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
    //     sunface.x - (renderFlares.w / 2 ), sunface.y - (renderFlares.h / 2 ), renderFlares.w, renderFlares.h
    // );

    // coronaLayerCtx.globalCompositeOperation = 'lighter';

    // var renderGlare = sunSpikes.displayCfg.glareSpikes;

    // coronaLayerCtx.drawImage(
    //     sunSpikes.renderCfg.canvas,
    //     renderGlare.x, renderGlare.y, renderGlare.w, renderGlare.h,
    //     sunface.x - (renderGlare.w / 2 ), sunface.y - (renderGlare.h / 2 ), renderGlare.w, renderGlare.h
    // );


    ////////////////////////////////////////////
    
    

    //     sunSpikes.renderRainbowSpikes(
    //     {   
    //         x: sunface.x,
    //         y: sunface.y,
    //         imageCfg: imageAssetConfigs.rainbowGlareLong,
    //         d: 300
    //     },
    //     ctx
    // );
    

    // corona shine
    // ctx.fillStyle = coronaGradien2;
    // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 3 );
    if ( !overlayCfg.displayGlareSpikes ) {
        
        // ctx.globalCompositeOperation = 'destination-over';
        // ctx.fillStyle = coronaGradient2;
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 10 );
        
        // ctx.fillStyle = coronaGradient3;
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 5 );

        // ctx.globalCompositeOperation = 'source-over';
        // ctx.fillStyle = coronaGradient;
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r * 3 );
        // ctx.globalCompositeOperation = 'lighter';



        // sunSpikes.displayCorona();

        // var renderFlares = sunSpikes.displayCfg.flares;

        // coronaLayerCtx.drawImage(
        //     sunSpikes.flareOptions.canvas,
        //     renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
        //     sunface.x - (renderFlares.w / 2 ), sunface.y - (renderFlares.h / 2 ), renderFlares.w, renderFlares.h
        // );

        

        drawFeatures();

        // lensFlare.displayFlares();

    }
    
    

    // drawFeatures();

    // if ( rainbowRealImageLoaded === true ) {

    //     ctx.globalCompositeOperation = 'screen';

    //     ctx.translate( sunface.x, sunface.y );
    //     ctx.rotate( sunface.faceToStageCentreAngle );

    //     ctx.globalAlpha = 0.5;
    //     ctx.drawImage(
    //         rainbowRealImage,
    //          400 + -( rainbowRealImageCfg.w / 2 ),
    //         -( rainbowRealImageCfg.w / 2 ),
    //         rainbowRealImageCfg.w,
    //         rainbowRealImageCfg.h
    //     );
    //     ctx.globalAlpha = 1;
    //     ctx.rotate( -sunface.faceToStageCentreAngle );
    //     ctx.translate( -sunface.x, -sunface.y );
    // }


    //////////////////////////////////
}

function drawFeatures() {
    ctx.lineWidth = sunface.lines.inner;
    ctx.lineCap = 'round';
    // sunCorona.render( sunface.x, sunface.y, sineWave.val, sineWave.invVal, ctx );

    ctx.globalCompositeOperation = 'source-over';

    var leftEye = faceCoords.eyes.left;
    var rightEye = faceCoords.eyes.right;
    var mouth = faceCoords.mouth;

    // base shape
        // ctx.fillStyle = 'white';
        // ctx.fillCircle( sunface.x, sunface.y, sunface.r );
        ctx.fillStyle = faceGradient;
        ctx.fillCircle( sunface.x, sunface.y, sunface.r );
        // ctx.strokeCircle( sunface.x, sunface.y, sunface.r );

        ctx.lineWidth = sunface.lines.inner;

        if ( !overlayCfg.displayOverlay ) {

            ctx.fillStyle = sunface.colours.base.orange;
            ctx.strokeStyle = sunface.colours.base.orange;
        } else {
            ctx.fillStyle = sunface.colours.debug.dimmed;
            ctx.strokeStyle = sunface.colours.debug.dimmed;
        }

    // eye shadows
        drawEyeShadows( faceCoords.eyes, baseFaceCoords.eyes, faceCoords.eyebrows );

    // nose shadow
        drawNoseShadow( faceCoords.nose, faceCoords.mouth );

    // masks

        ctx.save();

    // left eyeshape
        ctx.beginPath();

        ctx.moveTo( leftEye.lPointX, leftEye.lPointY );
        ctx.quadraticCurveTo(
            leftEye.tHandleX, leftEye.tHandleY,
            leftEye.rPointX, leftEye.rPointY
        );
        ctx.quadraticCurveTo(
            leftEye.bHandleX, leftEye.bHandleY,
            leftEye.lPointX, leftEye.lPointY
        );
        ctx.closePath();

        ctx.clip();
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgb( 230, 230, 230 )';
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }

        ctx.fillRect( leftEyeBaseX - eyeBaseRadius, leftEyeBaseY - eyeBaseRadius, eyeBaseRadius * 2, eyeBaseRadius * 2 );

        drawLeftPupil( faceCoords.eyes.pupils, aimConstraint.eyes );

        ctx.restore();

    // right eyeshape
        ctx.save();

        ctx.beginPath();
        ctx.moveTo( rightEye.lPointX, rightEye.lPointY );
        ctx.quadraticCurveTo(
            rightEye.tHandleX, rightEye.tHandleY,
            rightEye.rPointX, rightEye.rPointY
        );
        ctx.quadraticCurveTo(
            rightEye.bHandleX, rightEye.bHandleY,
            rightEye.lPointX, rightEye.lPointY
        );
        ctx.closePath();

        ctx.clip();
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgb( 230, 230, 230 )';
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }
        ctx.fillRect( rightEyeBaseX - eyeBaseRadius, rightEyeBaseY - eyeBaseRadius, eyeBaseRadius * 2, eyeBaseRadius * 2 );

        drawRightPupil( faceCoords.eyes.pupils, aimConstraint.eyes );

        ctx.restore();

    // mouth

        ctx.save();

        // top lip shape
        ctx.beginPath();
        ctx.moveTo( mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y );

        // top left inner bow
        ctx.bezierCurveTo(
            mouth.top_left_inner_cp1_X, mouth.top_left_inner_cp1_Y,
            mouth.top_left_inner_cp2_X, mouth.top_left_inner_cp2_Y,
            mouth.top_inner_anchor_X, mouth.top_inner_anchor_Y
        );

        // top right inner bow
        ctx.bezierCurveTo(
            mouth.top_right_inner_cp2_X, mouth.top_right_inner_cp2_Y,
            mouth.top_right_inner_cp1_X, mouth.top_right_inner_cp1_Y,
            mouth.right_inner_anchor_X, mouth.right_inner_anchor_Y
        );

        // bottom lip shape

        // bottom right inner bow
        ctx.bezierCurveTo(
            mouth.bottom_right_inner_cp1_X, mouth.bottom_right_inner_cp1_Y,
            mouth.bottom_right_inner_cp2_X, mouth.bottom_right_inner_cp2_Y,
            mouth.bottom_inner_anchor_X, mouth.bottom_inner_anchor_Y
        );

        // bottom left inner bow
        ctx.bezierCurveTo(
            mouth.bottom_left_inner_cp2_X, mouth.bottom_left_inner_cp2_Y,
            mouth.bottom_left_inner_cp1_X, mouth.bottom_left_inner_cp1_Y,
            mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y
        );

        ctx.closePath();

        ctx.clip();

    // masked elements
        // ctx.globalCompositeOperation = 'source-atop';

        // teeth

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
        }
        ctx.fillRect( mouthBaseX - pm.r2, mouthBaseY - pm.r2, sunface.r, sunface.r)

        ctx.lineWidth = sunface.lines.inner / 2;
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }
        drawTeeth( mouth );

        ctx.lineWidth = sunface.lines.inner;

        ctx.restore();

    // drawing

        // release mask
        ctx.globalCompositeOperation = 'source-over';
        let mouthGrads = faceCoords.gradients;
        let mouthGradX = faceCoords.mouth.left_outer_anchor_X;
        // set lip gradient
        var topLipGradient = ctx.createLinearGradient(
            mouthGradX, mouthGrads.topLip.top_Y,
            mouthGradX, mouthGrads.topLip.bottom_Y
        );
        topLipGradient.addColorStop( 0, coloring.rgba( 255, 50, 13, mouthGrads.topLip.bottom_opacity ) );
        topLipGradient.addColorStop( 1, coloring.rgba( 255, 50, 13, mouthGrads.topLip.top_opacity ) );
        // topLipGradient.addColorStop( 1, sunface.colours.rgba.orangeShadowLight );

        var bottomLipGradient = ctx.createLinearGradient(
            mouthGradX, mouthGrads.bottomLip.bottom_Y,
            mouthGradX, mouthGrads.bottomLip.top_Y
        );
        bottomLipGradient.addColorStop( 0, coloring.rgba( 255, 156, 13, mouthGrads.bottomLip.bottom_opacity ) );
        // bottomLipGradient.addColorStop( 0.2, sunface.colours.rgba.orangeShadow );
        bottomLipGradient.addColorStop( 1, coloring.rgba( 255, 156, 13, mouthGrads.topLip.top_opacity ) );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = topLipGradient;
        } else {
            ctx.fillStyle = sunface.colours.debug.orange;
        }
    

    // Eyes
        drawEyeShapes();
    // Eyebrows
        drawEyebrows();
    // nose
        drawNose();
        ctx.lineCap="butt";

    // lip
        drawLipShadow();

    // mouth
        drawMouthShape( mouth, topLipGradient, bottomLipGradient );
    // chin
        drawChinShape();
    // cheeks
        // ctx.fillStyle = featureCreaseVerticalGradient;
        ctx.fillStyle = 'rgba( 255, 156, 13, 0.2 )';
        drawCheeks( faceCoords.innerCheeks.left, '32', pm, 5, ctx );
        drawCheeks( faceCoords.innerCheeks.right, '32', pm, 5, ctx );
        drawCheeks( faceCoords.outerCheeks.left, '16', pm, 10, ctx );
        drawCheeks( faceCoords.outerCheeks.right, '16', pm, 10, ctx );
}

// draw feature function set
    function drawEyebrows() {
        // left eyebrow
        ctx.beginPath();
        ctx.moveTo(
            faceCoords.eyebrows.left.lPointX, faceCoords.eyebrows.left.lPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.left.handle1X, faceCoords.eyebrows.left.handle1Y,
            faceCoords.eyebrows.left.handle2X, faceCoords.eyebrows.left.handle2Y,
            faceCoords.eyebrows.left.rPointX, faceCoords.eyebrows.left.rPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.left.handle2X, faceCoords.eyebrows.left.handle2Y + pm.r16,
            faceCoords.eyebrows.left.handle1X, faceCoords.eyebrows.left.handle1Y + pm.r16,
            faceCoords.eyebrows.left.lPointX, faceCoords.eyebrows.left.lPointY
        );
        ctx.fill();

        // right eyebrow
        ctx.beginPath();
        ctx.moveTo(
            faceCoords.eyebrows.right.lPointX, faceCoords.eyebrows.right.lPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.right.handle1X, faceCoords.eyebrows.right.handle1Y,
            faceCoords.eyebrows.right.handle2X, faceCoords.eyebrows.right.handle2Y,
            faceCoords.eyebrows.right.rPointX, faceCoords.eyebrows.right.rPointY
        );
        ctx.bezierCurveTo(
            faceCoords.eyebrows.right.handle2X, faceCoords.eyebrows.right.handle2Y + pm.r16,
            faceCoords.eyebrows.right.handle1X, faceCoords.eyebrows.right.handle1Y + pm.r16,
            faceCoords.eyebrows.right.lPointX, faceCoords.eyebrows.right.lPointY
        );
        ctx.fill();
    }

    function drawEyeShadows( eyes, baseEyes, eyeBrows ) {

        let leftEye = eyes.left;
        let leftEyeBase = baseEyes.left;
        let leftBrow = eyeBrows.left;
        let rightEye = eyes.right;
        let rightEyeBase = baseEyes.right;
        let rightBrow = eyeBrows.right;
        let elShift = 100000;

        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 15;

        // left eye shadow
        ctx.beginPath();
        ctx.moveTo( leftBrow.lPointX, leftBrow.lPointY - elShift );
        ctx.bezierCurveTo(
            leftBrow.handle1X, leftBrow.handle1Y - elShift,
            leftBrow.handle2X, leftBrow.handle2Y - elShift,
            leftBrow.rPointX, leftBrow.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            leftEye.bHandleX + pm.r4, leftEye.bHandleY - pm.r32 - elShift,
            leftBrow.lPointX, leftBrow.lPointY - elShift
        );
        ctx.closePath();

        ctx.shadowOffsetX = -5;
        ctx.shadowOffsetY = elShift + 10;
        ctx.fill();

        // right eye shadow
        ctx.beginPath();
        ctx.moveTo( rightBrow.lPointX, rightBrow.lPointY - elShift );
        ctx.bezierCurveTo(
            rightBrow.handle1X, rightBrow.handle1Y - elShift,
            rightBrow.handle2X, rightBrow.handle2Y - elShift,
            rightBrow.rPointX, rightBrow.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            rightEye.bHandleX - pm.r4, rightEye.bHandleY - pm.r32 - elShift,
            rightBrow.lPointX, rightBrow.lPointY - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = elShift + 10;
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.shadowColor = "rgba( 255, 255, 100, 1 )";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;

        // left eyeBall shadow
        ctx.beginPath();
        ctx.moveTo( leftEyeBase.lPointX, leftEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            leftEyeBase.tHandleX, leftEyeBase.tHandleY - elShift,
            leftEyeBase.rPointX, leftEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            leftEyeBase.bHandleX, leftEyeBase.bHandleY - elShift,
            leftEyeBase.lPointX, leftEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        ctx.fill();

        // right eyeBall shadow
        ctx.beginPath();
        ctx.moveTo( rightEyeBase.lPointX, rightEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            rightEyeBase.tHandleX, rightEyeBase.tHandleY - elShift,
            rightEyeBase.rPointX, rightEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            rightEyeBase.bHandleX, rightEyeBase.bHandleY - elShift,
            rightEyeBase.lPointX, rightEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = sunface.colours.rgba.orangeShadowDark;
        ctx.shadowBlur = 3;
        // left eyeBall crease
        ctx.beginPath();
        ctx.moveTo( leftEyeBase.lPointX, leftEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            leftEyeBase.tHandleX, leftEyeBase.tHandleY - elShift,
            leftEyeBase.rPointX, leftEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            leftEyeBase.tHandleX, leftEyeBase.tHandleY - elShift + pm.r64,
            leftEyeBase.lPointX, leftEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo( rightEyeBase.lPointX, rightEyeBase.lPointY - elShift );
        ctx.quadraticCurveTo(
            rightEyeBase.tHandleX, rightEyeBase.tHandleY - elShift,
            rightEyeBase.rPointX, rightEyeBase.rPointY - elShift
        );
        ctx.quadraticCurveTo(
            rightEyeBase.tHandleX, rightEyeBase.tHandleY - elShift + pm.r64,
            rightEyeBase.lPointX, rightEyeBase.lPointY - elShift
        );
        ctx.closePath();
        ctx.fill();


        ctx.shadowBlur = 0;
    }

    function drawEyeShapes() {

        // left eyeshape
        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.tHandleX, faceCoords.eyes.left.tHandleY + pm.r32,
            faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.tHandleX, faceCoords.eyes.left.tHandleY - pm.r32,
            faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY
        );
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.bHandleX, faceCoords.eyes.left.bHandleY,
            faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.left.bHandleX, faceCoords.eyes.left.bHandleY + pm.r32,
            faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY
        );
        ctx.fill();

        // right eyeshape
        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.tHandleX, faceCoords.eyes.right.tHandleY + pm.r32,
            faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.tHandleX, faceCoords.eyes.right.tHandleY - pm.r32,
            faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY
        );
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo( faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.bHandleX, faceCoords.eyes.right.bHandleY,
            faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY
        );
        ctx.quadraticCurveTo(
            faceCoords.eyes.right.bHandleX, faceCoords.eyes.right.bHandleY + pm.r32,
            faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY
        );
        ctx.fill();
    }

    function drawLeftPupil( pupils, computedProperties ) {
        var leftEyeConstraintX, leftEyeConstraintY;

        if ( pupils.left.x + computedProperties.left.computed.x < pupils.left.x - computedProperties.config.r ) {
            leftEyeConstraintX = pupils.left.x - computedProperties.config.r;
        } else {
            if ( pupils.left.x + computedProperties.left.computed.x > pupils.left.x + computedProperties.config.r ) {
                leftEyeConstraintX = pupils.left.x + computedProperties.config.r;
            } else {
                leftEyeConstraintX = pupils.left.x + computedProperties.left.computed.x;
            }
        }

        if ( pupils.left.y + computedProperties.left.computed.y < pupils.left.y - computedProperties.config.r ) {
            leftEyeConstraintY = pupils.left.y - ( computedProperties.config.r / 1.1 );
        } else {
            if ( pupils.left.y + computedProperties.left.computed.y > pupils.left.y + ( computedProperties.config.r / 1.5 ) ) {
                leftEyeConstraintY = pupils.left.y + ( computedProperties.config.r / 1.5 );
            } else {
                leftEyeConstraintY = pupils.left.y + computedProperties.left.computed.y;
            }
        }

        var leftEyeDetails = trig.getAngleAndDistance(
            pupils.left.x, pupils.left.y,
            leftEyeConstraintX, leftEyeConstraintY
            );

        // (currentIteration, startValue, changeInValue, totalIterations)
        var leftEyeScale = easing.easeInSine( leftEyeDetails.distance, 1, -0.60 ,eyeBaseRadius);
        var leftEyeReverseScale = 1/leftEyeScale;


        // pupil
        ctx.translate( leftEyeConstraintX, leftEyeConstraintY );
        ctx.rotate( leftEyeDetails.angle );
        ctx.scale( leftEyeScale, 1 );

        // console.log( 'leftEyeDetails.angle: ', leftEyeDetails.angle );
        // console.log( 'leftEyeScale: ', leftEyeScale );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = sunface.colours.base.orange;
            ctx.strokeStyle = sunface.colours.base.orange;
        } else {
            ctx.fillStyle = sunface.colours.debug.dimmed;
            ctx.strokeStyle = sunface.colours.debug.dimmed;
        }

        ctx.fillCircle( 0, 0, pupils.left.r * 1.4 );

        // iris
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
        }
        ctx.fillCircle( 0, 0, pupils.left.r * 0.8 );

        ctx.scale( leftEyeReverseScale, 1 );
        ctx.rotate( -leftEyeDetails.angle );
        ctx.translate( -leftEyeConstraintX, -leftEyeConstraintY );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 100, 100, 200, 0.6 )';
            // ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'rgba( 150, 150, 255, 0 )';
        }

        var leftEye = faceCoords.eyes.left;

        // eyelid shadow
        ctx.beginPath();
        ctx.moveTo( leftEye.lPointX, leftEye.lPointY );
        ctx.quadraticCurveTo(
            leftEye.tHandleX, leftEye.tHandleY + pm.r16,
            leftEye.rPointX, leftEye.rPointY
        );
        ctx.lineTo( leftEye.rPointX, leftEye.rPointY - pm.r4 );
        ctx.lineTo( leftEye.lPointX, leftEye.lPointY - pm.r4 );
        ctx.closePath();
        ctx.fill();


        // eye spot shine
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
        } else {
            ctx.fillStyle = 'rgba( 255, 255, 255, 0.2 )';
        }
        ctx.fillCircle( leftEyeBaseX + pm.r32, leftEyeBaseY - pm.r64, pm.r32 );
    }

    function drawRightPupil( pupils, computedProperties ) {

        var rightEyeConstraintX, rightEyeConstraintY;

        if ( pupils.right.x + computedProperties.right.computed.x < pupils.right.x - computedProperties.config.r ) {
            rightEyeConstraintX = pupils.right.x - computedProperties.config.r;
        } else {
            if ( pupils.right.x + computedProperties.right.computed.x > pupils.right.x + computedProperties.config.r ) {
                rightEyeConstraintX = pupils.right.x + computedProperties.config.r;
            } else {
                rightEyeConstraintX = pupils.right.x + computedProperties.right.computed.x;
            }
        }

        if ( pupils.right.y + computedProperties.right.computed.y < pupils.right.y - computedProperties.config.r ) {
            rightEyeConstraintY = pupils.right.y - ( computedProperties.config.r / 1.1 );
        } else {
            if ( pupils.right.y + computedProperties.right.computed.y > pupils.right.y + ( computedProperties.config.r / 1.5 ) ) {
                rightEyeConstraintY = pupils.right.y + ( computedProperties.config.r / 1.5 );
            } else {
                rightEyeConstraintY = pupils.right.y + computedProperties.right.computed.y;
            }
        }

        var rightEyeDetails = trig.getAngleAndDistance(
            pupils.right.x, pupils.right.y,
            rightEyeConstraintX, rightEyeConstraintY
            );

        var rightEyeScale = easing.easeInSine( rightEyeDetails.distance, 1, -0.60 ,eyeBaseRadius);
        var rightEyeReverseScale = 1/rightEyeScale;

        // right pupil
        ctx.translate( rightEyeConstraintX, rightEyeConstraintY );
        ctx.rotate( rightEyeDetails.angle );
        ctx.scale( rightEyeScale, 1 );

        if ( !overlayCfg.displayOverlay ) {

            ctx.fillStyle = sunface.colours.base.orange;
            ctx.strokeStyle = sunface.colours.base.orange;
        } else {
            ctx.fillStyle = sunface.colours.debug.dimmed;
            ctx.strokeStyle = sunface.colours.debug.dimmed;
        }

        ctx.fillCircle( 0, 0, pupils.right.r * 1.4 );

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
        }
        ctx.fillCircle( 0, 0, pupils.right.r * 0.8 );
        ctx.scale( rightEyeReverseScale, 1 );
        ctx.rotate( -rightEyeDetails.angle );
        ctx.translate( -rightEyeConstraintX, -rightEyeConstraintY );


        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 100, 100, 200, 0.6 )';
            // ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'rgba( 150, 150, 255, 0 )';
        }

        var rightEye = faceCoords.eyes.right;

        ctx.beginPath();
        ctx.moveTo( rightEye.lPointX, rightEye.lPointY );
        ctx.quadraticCurveTo(
            rightEye.tHandleX, rightEye.tHandleY + pm.r16,
            rightEye.rPointX, rightEye.rPointY
        );
        ctx.lineTo( rightEye.rPointX, rightEye.rPointY - pm.r4 );
        ctx.lineTo( rightEye.lPointX, rightEye.lPointY - pm.r4 );
        ctx.closePath();
        ctx.fill();


        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'rgba( 255, 255, 255, 1 )';
        } else {
            ctx.fillStyle = 'rgba( 255, 255, 255, 0.2 )';
        }

        ctx.fillCircle( rightEyeBaseX + pm.r32, rightEyeBaseY - pm.r64, pm.r32 );
    }

    function drawCheeks( item, fillCurveOffset, propMeasure, blur,  context ) {
        
        var c = context;
        var offset = 'r'+fillCurveOffset;
        var item = item;
        var pm = propMeasure;
        var blurAmt = blur;
        var storeOffset = pm[ offset ];
        var renderOffset = 100000;

        c.beginPath();
        c.moveTo( item.tPointX, item.tPointY - renderOffset );
        c.quadraticCurveTo(
            item.handleX - storeOffset, item.handleY - renderOffset,
            item.bPointX, item.bPointY - renderOffset
        );
        c.quadraticCurveTo(
            item.handleX + storeOffset, item.handleY - renderOffset,
            item.tPointX, item.tPointY - renderOffset
        );

        c.shadowColor = sunface.colours.rgba.orangeShadowDark;
        c.shadowBlur = blurAmt;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = renderOffset;
        c.fill();
        c.shadowBlur = 0;
    }

    function drawNose() {

        ctx.beginPath();

        // point 1 ( start/finish )
        ctx.moveTo( faceCoords.nose.point1X, faceCoords.nose.point1Y + pm.r16 );

        // down curve outer
        ctx.quadraticCurveTo(
            faceCoords.nose.handle1X - pm.r32, faceCoords.nose.handle1Y,
            faceCoords.nose.point2X - pm.r32, faceCoords.nose.point2Y + pm.r32
        );
        // cross curve outer
        ctx.quadraticCurveTo(
            faceCoords.nose.handle2X, faceCoords.nose.handle2Y + pm.r32,
            faceCoords.nose.point3X, faceCoords.nose.point3Y
        );
        // cross curve inner ( return path )
        ctx.quadraticCurveTo(
            faceCoords.nose.handle2X, faceCoords.nose.handle2Y,
            faceCoords.nose.point2X, faceCoords.nose.point2Y
        );
        // down curve inner ( return path )
        ctx.quadraticCurveTo(
            faceCoords.nose.handle1X, faceCoords.nose.handle1Y,
            faceCoords.nose.point1X, faceCoords.nose.point1Y + pm.r16
        );
        ctx.closePath();
        // ctx.fill();
    }

    function drawNoseShadow( nose, mouth ) {

        let elShift = 100000;
        let nosePoints = nose;
        let mouthPoints = mouth;

        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 5;

        // nose shadow
        ctx.beginPath();
        ctx.moveTo( nosePoints.point2X - pm.r16, nosePoints.point2Y - pm.r32 - elShift );
        ctx.quadraticCurveTo(
            nosePoints.handle2X, nosePoints.handle2Y - elShift,
            nosePoints.point3X + pm.r16, nosePoints.point3Y - pm.r32 - elShift
        );
        ctx.quadraticCurveTo(
            mouthPoints.top_outer_anchor_X, mouthPoints.top_outer_anchor_Y + pm.r16 - elShift,
            nosePoints.point2X - pm.r16, nosePoints.point2Y - pm.r32 - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        ctx.fill();

        ctx.shadowBlur = 1;

        ctx.beginPath();
        ctx.moveTo( nosePoints.point2X, nosePoints.point2Y - elShift );
        ctx.quadraticCurveTo(
            nosePoints.handle2X, nosePoints.handle2Y - elShift,
            nosePoints.point3X, nosePoints.point3Y - elShift
        );
        ctx.quadraticCurveTo(
            nosePoints.handle2X, nosePoints.handle2Y + pm.r16 - elShift,
            nosePoints.point2X, nosePoints.point2Y - elShift
        );
        ctx.closePath();
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift - 5;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawMouthShape( item, topGradient, bottomGradient ) {

        // top lip shape
        ctx.beginPath();
        ctx.moveTo( item.left_outer_anchor_X, item.left_outer_anchor_Y );
        ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y );

        // top left inner bow
        ctx.bezierCurveTo(
            item.top_left_inner_cp1_X, item.top_left_inner_cp1_Y,
            item.top_left_inner_cp2_X, item.top_left_inner_cp2_Y,
            item.top_inner_anchor_X, item.top_inner_anchor_Y
        );

        // top right inner bow
        ctx.bezierCurveTo(
            item.top_right_inner_cp2_X, item.top_right_inner_cp2_Y,
            item.top_right_inner_cp1_X, item.top_right_inner_cp1_Y,
            item.right_inner_anchor_X, item.right_inner_anchor_Y
        );

        ctx.lineTo( item.right_outer_anchor_X, item.right_outer_anchor_Y );

        // top right outer bow
        ctx.bezierCurveTo(
            item.top_right_outer_cp1_X, item.top_right_outer_cp1_Y,
            item.top_right_outer_cp2_X, item.top_right_outer_cp2_Y,
            item.top_outer_anchor_X, item.top_outer_anchor_Y
        );
        // top left outer bow
        ctx.bezierCurveTo(
            item.top_left_outer_cp2_X, item.top_left_outer_cp2_Y,
            item.top_left_outer_cp1_X , item.top_left_outer_cp1_Y,
            item.left_outer_anchor_X, item.left_outer_anchor_Y
        );
        ctx.closePath();

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = topGradient;
        } else {
            ctx.fillStyle = sunface.colours.debug.orange;
        }

        ctx.fill();


        // bottom lip shape
        ctx.beginPath();
        ctx.moveTo( item.left_outer_anchor_X, item.left_outer_anchor_Y );
        ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y );

        // bottom left inner bow
        ctx.bezierCurveTo(
            item.bottom_left_inner_cp1_X, item.bottom_left_inner_cp1_Y,
            item.bottom_left_inner_cp2_X, item.bottom_left_inner_cp2_Y,
            item.bottom_inner_anchor_X, item.bottom_inner_anchor_Y
        );

        // bottom right inner bow
        ctx.bezierCurveTo(
            item.bottom_right_inner_cp2_X, item.bottom_right_inner_cp2_Y,
            item.bottom_right_inner_cp1_X, item.bottom_right_inner_cp1_Y,
            item.right_inner_anchor_X, item.right_inner_anchor_Y
        );

        ctx.lineTo( item.right_outer_anchor_X, item.right_outer_anchor_Y );

        // bottom right outer bow
        ctx.bezierCurveTo(
            item.bottom_right_outer_cp1_X, item.bottom_right_outer_cp1_Y,
            item.bottom_right_outer_cp2_X, item.bottom_right_outer_cp2_Y,
            item.bottom_outer_anchor_X, item.bottom_outer_anchor_Y
        );
        // bottom left outer bow
        ctx.bezierCurveTo(
            item.bottom_left_outer_cp2_X, item.bottom_left_outer_cp2_Y,
            item.bottom_left_outer_cp1_X, item.bottom_left_outer_cp1_Y,
            item.left_outer_anchor_X, item.left_outer_anchor_Y
        );
        ctx.closePath();
        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = bottomGradient;
        } else {
            ctx.fillStyle = sunface.colours.debug.orange;
        }
        ctx.fill();

        // // bottom lip shape
        // ctx.beginPath();
        // ctx.moveTo( item.left_outer_anchor_X, item.left_outer_anchor_Y - 100000 );
        // ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y - 100000 );

        // // bottom left inner bow
        // ctx.bezierCurveTo(
        //     item.bottom_left_inner_cp1_X, item.bottom_left_inner_cp1_Y - 100000,
        //     item.bottom_left_inner_cp2_X, item.bottom_left_inner_cp2_Y - 100000,
        //     item.bottom_inner_anchor_X, item.bottom_inner_anchor_Y - 100000
        // );

        // // bottom right inner bow
        // ctx.bezierCurveTo(
        //     item.bottom_right_inner_cp2_X, item.bottom_right_inner_cp2_Y - 100000,
        //     item.bottom_right_inner_cp1_X, item.bottom_right_inner_cp1_Y - 100000,
        //     item.right_inner_anchor_X, item.right_inner_anchor_Y - 100000
        // );

        // ctx.lineTo( item.right_outer_anchor_X, item.right_outer_anchor_Y - 100000 );

        // // bottom right outer bow
        // ctx.bezierCurveTo(
        //     item.bottom_right_outer_cp1_X, item.bottom_right_outer_cp1_Y - 100000,
        //     item.bottom_right_outer_cp2_X, item.bottom_right_outer_cp2_Y - 100000,
        //     item.bottom_outer_anchor_X, item.bottom_outer_anchor_Y - 100000
        // );
        // // bottom left outer bow
        // ctx.bezierCurveTo(
        //     item.bottom_left_outer_cp2_X, item.bottom_left_outer_cp2_Y - 100000,
        //     item.bottom_left_outer_cp1_X, item.bottom_left_outer_cp1_Y - 100000,
        //     item.left_outer_anchor_X, item.left_outer_anchor_Y - 100000
        // );
        // ctx.closePath();
        
        // if ( !overlayCfg.displayOverlay ) {
        //     ctx.fillStyle = sunface.colours.base.yellow;
        // } else {
        //     ctx.fillStyle = sunface.colours.debug.orange;
        // }

        // ctx.shadowColor = 'rgba( 255, 255, 100, 0.5 )';
        // ctx.shadowBlur = 15;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 100000;

        // ctx.fill();

        // ctx.shadowOffsetY = 0;
    }

    function drawTeeth( item ) {

        ctx.save();

        if ( !overlayCfg.displayOverlay ) {
            ctx.fillStyle = 'white';
            ctx.strokeWidth = 2;
            ctx.strokeStyle = sunface.colours.base.whiteShadow;
        } else {
            ctx.fillStyle = sunface.colours.debug.fillsTeeth;
        }

        // bottom
        drawBottomTeeth( item );

        // top
        drawTopTeeth( item );

        // teeth shadow ( dont show on debug mode )
        if ( !overlayCfg.displayOverlay ) {
            drawToothShadow( item );
        }

        ctx.restore();
    }

    function drawTopTeeth( item ) {
        // top
        var teeth = faceCoords.teeth.top;
        var toothBaselineY = teeth.lPoint2Y + pm.r64;

        ctx.beginPath();

        ctx.moveTo( teeth.lPoint1X - pm.r16 - pm.r32, teeth.lPoint1Y );
        
        /////// individual teeth
        // left canine
        ctx.lineTo( teeth.lPoint2X - pm.r16, toothBaselineY - pm.r32 );
            
        ctx.quadraticCurveTo(
            teeth.lPoint2X + pm.r128, toothBaselineY + ( pm.r16 - pm.r64 ),
            teeth.lPoint2X + pm.r64, toothBaselineY
        );
        // left incisor
        ctx.quadraticCurveTo(
            teeth.lPoint2X + pm.r16 + pm.r32, toothBaselineY + pm.r32,
            teeth.lPoint2X + pm.r8, toothBaselineY
        );
        // centre left incisor
        ctx.quadraticCurveTo(
            teeth.handleX - pm.r16, toothBaselineY + pm.r32,
            teeth.handleX, toothBaselineY + pm.r64
        );

        // centre right incisor
        ctx.quadraticCurveTo(
            teeth.handleX + pm.r16, toothBaselineY + pm.r32,
            teeth.rPoint2X - pm.r8, toothBaselineY
        );
        // right incisor
        ctx.quadraticCurveTo(
            teeth.rPoint2X - pm.r16 - pm.r32, toothBaselineY + pm.r32,
            teeth.rPoint2X - pm.r64, toothBaselineY
        );
        // right canine
        ctx.quadraticCurveTo(
            teeth.rPoint2X - pm.r128, toothBaselineY + ( pm.r16 - pm.r64 ),
            teeth.rPoint2X + pm.r16, toothBaselineY - pm.r32
        );

        ctx.lineTo( teeth.rPoint2X + pm.r16 + pm.r32, teeth.rPoint2Y );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawBottomTeeth( item ) {

        var teeth = faceCoords.teeth.bottom;
        var teethConfig = teeth.config;
        var toothBaselineY = teeth.lPoint2Y + pm.r64;
        var currX = 0;
        ctx.beginPath();

        // bottom left corner
        ctx.moveTo( teeth.lPoint1X, teeth.lPoint1Y + pm.r8 );

        // left preMolar
        ctx.lineTo( teeth.lPoint2X - pm.r64, toothBaselineY + pm.r32 );
        currX = teeth.lPoint2X - pm.r64;

        ctx.quadraticCurveTo(
            currX + teethConfig.preMolarControl, toothBaselineY - pm.r32,
            currX + teethConfig.preMolarWidth, toothBaselineY
        );
        currX += teethConfig.preMolarWidth
        // left canine
        ctx.quadraticCurveTo(
            currX + teethConfig.canineControl, toothBaselineY - pm.r32 - pm.r64,
            currX + teethConfig.canineWidth, toothBaselineY
        );
        currX += teethConfig.canineWidth;

        // left incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // center left incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // center right incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // right incisor
        ctx.quadraticCurveTo(
            currX + teethConfig.incisorControl, toothBaselineY - pm.r64,
            currX + teethConfig.incisorWidth, toothBaselineY
        );
        currX += teethConfig.incisorWidth;

        // right canine
        ctx.quadraticCurveTo(
            ( currX + teethConfig.canineWidth ) - teethConfig.canineControl, toothBaselineY - pm.r32 - pm.r64,
            currX + teethConfig.canineWidth, toothBaselineY
        );
        currX += teethConfig.canineWidth;

        // right premolar
        ctx.quadraticCurveTo(
            currX + teethConfig.preMolarControl, toothBaselineY - pm.r32,
            teeth.rPoint2X + pm.r64, toothBaselineY + pm.r32
        );

        // bottom right corner
        ctx.lineTo( teeth.rPoint2X, teeth.rPoint2Y + pm.r8 );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawToothShadow( item ) {
        ctx.globalCompositeOperation = 'multiply';
        let teethColour = faceCoords.gradients.teethShadow.curr;
        ctx.fillStyle = coloring.rgb( teethColour.r, teethColour.g, teethColour.b );

        // draw inverse upper lip shape
        ctx.beginPath();
        ctx.moveTo( item.left_inner_anchor_X, item.left_inner_anchor_Y - pm.r4 );
        ctx.lineTo( item.left_inner_anchor_X - pm.r8, item.left_inner_anchor_Y + pm.r16 );
        ctx.lineTo( item.left_inner_anchor_X, item.left_inner_anchor_Y + pm.r16 );

        // top left bow
        ctx.bezierCurveTo(
            item.top_left_inner_cp1_X, item.top_left_inner_cp1_Y + pm.r32,
            item.top_left_inner_cp2_X, item.top_left_inner_cp2_Y + pm.r64,
            item.top_inner_anchor_X, item.top_inner_anchor_Y + pm.r64
        );

        // top right bow
        ctx.bezierCurveTo(
            item.top_right_inner_cp2_X, item.top_right_inner_cp2_Y + pm.r64,
            item.top_right_inner_cp1_X, item.top_right_inner_cp1_Y + pm.r32,
            item.right_inner_anchor_X, item.right_inner_anchor_Y + pm.r16
        );
        ctx.lineTo( item.right_inner_anchor_X + pm.r8, item.right_inner_anchor_Y + pm.r16 );
        ctx.lineTo( item.right_inner_anchor_X, item.right_inner_anchor_Y - pm.r4 );
        ctx.closePath();
        ctx.fill();
    }

    function drawLipShadow() {

        var elShift = 100000;

        ctx.beginPath();
        ctx.moveTo( 
            faceCoords.mouth.left_outer_anchor_X + pm.r16, faceCoords.mouth.left_outer_anchor_Y - elShift );
        ctx.quadraticCurveTo(
            faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y - pm.r32 - elShift,
            faceCoords.mouth.right_outer_anchor_X - pm.r16, faceCoords.mouth.right_outer_anchor_Y - elShift
        );
        ctx.lineTo( faceCoords.chin.point2X - pm.r16, ( faceCoords.chin.point2Y - pm.r4 ) - elShift );
        ctx.quadraticCurveTo(
            faceCoords.chin.handle1X, faceCoords.chin.handle1Y - pm.r4 - pm.r16 - elShift,
            faceCoords.chin.point1X + pm.r16, ( faceCoords.chin.point1Y - pm.r4 ) - elShift
        );
        ctx.closePath();
        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        // ctx.fillStyle = 'rgba( 0, 0, 0, 0)';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo( 
            faceCoords.mouth.left_outer_anchor_X + pm.r16, faceCoords.mouth.left_outer_anchor_Y + pm.r16 - elShift );
        ctx.quadraticCurveTo(
            faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y + pm.r16 - elShift,
            faceCoords.mouth.right_outer_anchor_X - pm.r16, faceCoords.mouth.right_outer_anchor_Y + pm.r16 - elShift
        );
        ctx.quadraticCurveTo(
            faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y + pm.r8 - elShift,
            faceCoords.mouth.left_outer_anchor_X + pm.r16, faceCoords.mouth.left_outer_anchor_Y + pm.r16 - elShift
        );
        ctx.closePath();
        ctx.shadowColor = sunface.colours.rgba.orangeShadowDark;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        // ctx.fillStyle = 'rgba( 0, 0, 0, 0)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function drawChinShape() {

        var elShift = 100000;

        ctx.beginPath();
        ctx.moveTo( faceCoords.chin.point1X, ( faceCoords.chin.point1Y - pm.r32 ) - elShift );
        ctx.quadraticCurveTo(
            faceCoords.chin.handle1X, ( faceCoords.chin.handle1Y - pm.r32 ) - elShift,
            faceCoords.chin.point2X, ( faceCoords.chin.point2Y - pm.r32 ) - elShift
        );
        ctx.quadraticCurveTo(
            faceCoords.chin.handle1X, ( faceCoords.chin.handle1Y + pm.r32 ) - elShift,
            faceCoords.chin.point1X, ( faceCoords.chin.point1Y - pm.r32 ) - elShift
        );

        ctx.shadowColor = sunface.colours.rgba.orangeShadow;
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = elShift;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

function drawMuscleGroups() {

    var mscGrpPointRadius = 10;
    var anchorRadius = 2;
    if ( overlayCfg.displayHulls === true ) {
        anchorRadius = 4;
    }

    //////////////// Anchors ////////////////

    if ( overlayCfg.displayAnchors === true ) {

        ctx.fillStyle = 'red';

        //////// Eyebrows

        // Left
        ctx.fillCircle( faceCoords.eyebrows.left.lPointX, faceCoords.eyebrows.left.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.left.rPointX, faceCoords.eyebrows.left.rPointY, anchorRadius );
        // right
        ctx.fillCircle( faceCoords.eyebrows.right.lPointX, faceCoords.eyebrows.right.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.right.rPointX, faceCoords.eyebrows.right.rPointY, anchorRadius );


        //////// Eyes
        
        // Left
        ctx.fillCircle( faceCoords.eyes.left.lPointX, faceCoords.eyes.left.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyes.left.rPointX, faceCoords.eyes.left.rPointY, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.eyes.right.lPointX, faceCoords.eyes.right.lPointY, anchorRadius );
        ctx.fillCircle( faceCoords.eyes.right.rPointX, faceCoords.eyes.right.rPointY, anchorRadius );


        //////// Nose
        
        ctx.fillCircle( faceCoords.nose.point1X, faceCoords.nose.point1Y, anchorRadius );
        ctx.fillCircle( faceCoords.nose.point2X, faceCoords.nose.point2Y, anchorRadius );
        ctx.fillCircle( faceCoords.nose.point3X, faceCoords.nose.point3Y, anchorRadius );


        //////// Mouth

        // left
        ctx.fillCircle( faceCoords.mouth.left_outer_anchor_X, faceCoords.mouth.left_outer_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.left_inner_anchor_X, faceCoords.mouth.left_inner_anchor_Y, anchorRadius );
        // top
        ctx.fillCircle( faceCoords.mouth.top_inner_anchor_X, faceCoords.mouth.top_inner_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_outer_anchor_X, faceCoords.mouth.top_outer_anchor_Y, anchorRadius );
        // bottom
        ctx.fillCircle( faceCoords.mouth.bottom_inner_anchor_X, faceCoords.mouth.bottom_inner_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_outer_anchor_X, faceCoords.mouth.bottom_outer_anchor_Y, anchorRadius );
        // right
        ctx.fillCircle( faceCoords.mouth.right_outer_anchor_X, faceCoords.mouth.right_outer_anchor_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.right_inner_anchor_X, faceCoords.mouth.right_inner_anchor_Y, anchorRadius );

        
        //////// Lip

        ctx.fillCircle( faceCoords.lip.point1X, faceCoords.lip.point1Y, anchorRadius );
        ctx.fillCircle( faceCoords.lip.point2X, faceCoords.lip.point2Y, anchorRadius );


        //////// Chin

        ctx.fillCircle( faceCoords.chin.point1X, faceCoords.chin.point1Y, anchorRadius );
        ctx.fillCircle( faceCoords.chin.point2X, faceCoords.chin.point2Y, anchorRadius );


        //////// Inner Cheeks

        // Left
        ctx.fillCircle( faceCoords.innerCheeks.left.tPointX, faceCoords.innerCheeks.left.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.innerCheeks.left.bPointX, faceCoords.innerCheeks.left.bPointY, anchorRadius );

        // Right
        ctx.fillCircle( faceCoords.innerCheeks.right.tPointX, faceCoords.innerCheeks.right.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.innerCheeks.right.bPointX, faceCoords.innerCheeks.right.bPointY, anchorRadius );


        //////// Outer Cheeks

        // Left
        ctx.fillCircle( faceCoords.outerCheeks.left.tPointX, faceCoords.outerCheeks.left.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.outerCheeks.left.bPointX, faceCoords.outerCheeks.left.bPointY, anchorRadius );

        // Right
        ctx.fillCircle( faceCoords.outerCheeks.right.tPointX, faceCoords.outerCheeks.right.tPointY, anchorRadius );
        ctx.fillCircle( faceCoords.outerCheeks.right.bPointX, faceCoords.outerCheeks.right.bPointY, anchorRadius );

    }


    //////////////// control points ////////////////

    if ( overlayCfg.displayControlPoints === true ) {

        ctx.fillStyle = 'green';

        //////// Eyebrows

        // Left
        ctx.fillCircle( faceCoords.eyebrows.left.handle1X, faceCoords.eyebrows.left.handle1Y, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.left.handle2X, faceCoords.eyebrows.left.handle2Y, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.eyebrows.right.handle1X, faceCoords.eyebrows.right.handle1Y, anchorRadius );
        ctx.fillCircle( faceCoords.eyebrows.right.handle2X, faceCoords.eyebrows.right.handle2Y, anchorRadius );


        //////// Eyes
        
        // Left top lid
        ctx.fillCircle( faceCoords.eyes.left.tHandleX, faceCoords.eyes.left.tHandleY, anchorRadius );
        // Left bottom lid
        ctx.fillCircle( faceCoords.eyes.left.bHandleX, faceCoords.eyes.left.bHandleY, anchorRadius );

        // Right top lid
        ctx.fillCircle( faceCoords.eyes.right.tHandleX, faceCoords.eyes.right.tHandleY, anchorRadius );
        // Right bottom lid
        ctx.fillCircle( faceCoords.eyes.right.bHandleX, faceCoords.eyes.right.bHandleY, anchorRadius );


        //////// Nose
        
        ctx.fillCircle( faceCoords.nose.handle1X, faceCoords.nose.handle1Y, anchorRadius );
        ctx.fillCircle( faceCoords.nose.handle2X, faceCoords.nose.handle2Y, anchorRadius );

        //////// Mouth

        ctx.fillCircle( faceCoords.mouth.top_left_inner_cp1_X, faceCoords.mouth.top_left_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_left_inner_cp2_X, faceCoords.mouth.top_left_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.top_left_outer_cp1_X, faceCoords.mouth.top_left_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_left_outer_cp2_X, faceCoords.mouth.top_left_outer_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.top_right_inner_cp1_X, faceCoords.mouth.top_right_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_right_inner_cp2_X, faceCoords.mouth.top_right_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.top_right_outer_cp1_X, faceCoords.mouth.top_right_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.top_right_outer_cp2_X, faceCoords.mouth.top_right_outer_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_left_inner_cp1_X, faceCoords.mouth.bottom_left_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_left_inner_cp2_X, faceCoords.mouth.bottom_left_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_left_outer_cp1_X, faceCoords.mouth.bottom_left_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_left_outer_cp2_X, faceCoords.mouth.bottom_left_outer_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_right_inner_cp1_X, faceCoords.mouth.bottom_right_inner_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_right_inner_cp2_X, faceCoords.mouth.bottom_right_inner_cp2_Y, anchorRadius );

        ctx.fillCircle( faceCoords.mouth.bottom_right_outer_cp1_X, faceCoords.mouth.bottom_right_outer_cp1_Y, anchorRadius );
        ctx.fillCircle( faceCoords.mouth.bottom_right_outer_cp2_X, faceCoords.mouth.bottom_right_outer_cp2_Y, anchorRadius );


        //////// Lip
        
        ctx.fillCircle( faceCoords.lip.handle1X, faceCoords.lip.handle1Y, anchorRadius );


        //////// chin
        
        ctx.fillCircle( faceCoords.chin.handle1X, faceCoords.chin.handle1Y, anchorRadius );


        //////// Inner Cheeks

        // Left
        ctx.fillCircle( faceCoords.innerCheeks.left.handleX, faceCoords.innerCheeks.left.handleY, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.innerCheeks.right.handleX, faceCoords.innerCheeks.right.handleY, anchorRadius );


        //////// Outer Cheeks

        // Left
        ctx.fillCircle( faceCoords.outerCheeks.left.handleX, faceCoords.outerCheeks.left.handleY, anchorRadius );
        // Right
        ctx.fillCircle( faceCoords.outerCheeks.right.handleX, faceCoords.outerCheeks.right.handleY, anchorRadius );
    
    }

    //////////////// Hulls ////////////////

    if ( overlayCfg.displayHulls === true ) {

        ctx.setLineDash([3, 3]);

        //////// Eyebrows
        var browL = faceCoords.eyebrows.left;
        var browR = faceCoords.eyebrows.right;
        // Left
        ctx.line( browL.lPointX, browL.lPointY, browL.handle1X, browL.handle1Y);
        ctx.line( browL.handle1X, browL.handle1Y, browL.handle2X, browL.handle2Y);
        ctx.line( browL.handle2X, browL.handle2Y, browL.rPointX, browL.rPointY );
        // Right
        ctx.line( browR.lPointX, browR.lPointY, browR.handle1X, browR.handle1Y);
        ctx.line( browR.handle1X, browR.handle1Y, browR.handle2X, browR.handle2Y);
        ctx.line( browR.handle2X, browR.handle2Y, browR.rPointX, browR.rPointY );


        //////// Eyes
        var eyeL = faceCoords.eyes.left;
        var eyeR = faceCoords.eyes.right;
        // Left
        ctx.line( eyeL.lPointX, eyeL.lPointY, eyeL.tHandleX, eyeL.tHandleY);
        ctx.line( eyeL.tHandleX, eyeL.tHandleY, eyeL.rPointX, eyeL.rPointY );
        ctx.line( eyeL.rPointX, eyeL.rPointY, eyeL.bHandleX, eyeL.bHandleY);
        ctx.line( eyeL.bHandleX, eyeL.bHandleY, eyeL.lPointX, eyeL.lPointY );
        // Right
        ctx.line( eyeR.lPointX, eyeR.lPointY, eyeR.tHandleX, eyeR.tHandleY);
        ctx.line( eyeR.tHandleX, eyeR.tHandleY, eyeR.rPointX, eyeR.rPointY );
        ctx.line( eyeR.rPointX, eyeR.rPointY, eyeR.bHandleX, eyeR.bHandleY);
        ctx.line( eyeR.bHandleX, eyeR.bHandleY, eyeR.lPointX, eyeR.lPointY );


        //////// Nose
        var nose = faceCoords.nose;

        ctx.line( nose.point1X, nose.point1Y, nose.handle1X, nose.handle1Y);
        ctx.line( nose.handle1X, nose.handle1Y, nose.point2X, nose.point2Y);
        ctx.line( nose.point2X, nose.point2Y, nose.handle2X, nose.handle2Y);
        ctx.line( nose.handle2X, nose.handle2Y, nose.point3X, nose.point3Y);


        //////// Mouth
        var mouth = faceCoords.mouth;


        ctx.beginPath();
        ctx.moveTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.lineTo( mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y );
        ctx.lineTo( mouth.top_left_inner_cp1_X, mouth.top_left_inner_cp1_Y );
        ctx.lineTo( mouth.top_left_inner_cp2_X, mouth.top_left_inner_cp2_Y );
        ctx.lineTo( mouth.top_inner_anchor_X, mouth.top_inner_anchor_Y );
        ctx.lineTo( mouth.top_right_inner_cp2_X, mouth.top_right_inner_cp2_Y );
        ctx.lineTo( mouth.top_right_inner_cp1_X, mouth.top_right_inner_cp1_Y );
        ctx.lineTo( mouth.right_inner_anchor_X, mouth.right_inner_anchor_Y );
        ctx.lineTo( mouth.right_outer_anchor_X, mouth.right_outer_anchor_Y );
        ctx.lineTo( mouth.top_right_outer_cp1_X, mouth.top_right_outer_cp1_Y );
        ctx.lineTo( mouth.top_right_outer_cp2_X, mouth.top_right_outer_cp2_Y );
        ctx.lineTo( mouth.top_outer_anchor_X, mouth.top_outer_anchor_Y );
        ctx.lineTo( mouth.top_left_outer_cp2_X, mouth.top_left_outer_cp2_Y );
        ctx.lineTo( mouth.top_left_outer_cp1_X, mouth.top_left_outer_cp1_Y );
        ctx.lineTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.lineTo( mouth.left_inner_anchor_X, mouth.left_inner_anchor_Y );
        ctx.lineTo( mouth.bottom_left_inner_cp1_X, mouth.bottom_left_inner_cp1_Y );
        ctx.lineTo( mouth.bottom_left_inner_cp2_X, mouth.bottom_left_inner_cp2_Y );
        ctx.lineTo( mouth.bottom_inner_anchor_X, mouth.bottom_inner_anchor_Y );
        ctx.lineTo( mouth.bottom_right_inner_cp2_X, mouth.bottom_right_inner_cp2_Y );
        ctx.lineTo( mouth.bottom_right_inner_cp1_X, mouth.bottom_right_inner_cp1_Y );
        ctx.lineTo( mouth.right_inner_anchor_X, mouth.right_inner_anchor_Y );
        ctx.lineTo( mouth.right_outer_anchor_X, mouth.right_outer_anchor_Y );
        ctx.lineTo( mouth.bottom_right_outer_cp1_X, mouth.bottom_right_outer_cp1_Y );
        ctx.lineTo( mouth.bottom_right_outer_cp2_X, mouth.bottom_right_outer_cp2_Y );
        ctx.lineTo( mouth.bottom_outer_anchor_X, mouth.bottom_outer_anchor_Y );
        ctx.lineTo( mouth.bottom_left_outer_cp2_X, mouth.bottom_left_outer_cp2_Y );
        ctx.lineTo( mouth.bottom_left_outer_cp1_X, mouth.bottom_left_outer_cp1_Y );
        ctx.lineTo( mouth.left_outer_anchor_X, mouth.left_outer_anchor_Y );
        ctx.closePath();
        ctx.stroke();

        // ctx.line( mouth.lPointX, mouth.lPointY, mouth.top_left_cp1_X, mouth.top_left_cp1_Y);
        // ctx.line( mouth.top_left_cp1_X, mouth.top_left_cp1_Y, mouth.top_left_cp2_X, mouth.top_left_cp2_Y);
        // ctx.line( mouth.top_left_cp2_X, mouth.top_left_cp2_Y, mouth.top_anchor_X, mouth.top_anchor_Y);
        // ctx.line( mouth.top_anchor_X, mouth.top_anchor_Y, mouth.top_right_cp2_X, mouth.top_right_cp2_Y );
        // ctx.line( mouth.top_right_cp2_X, mouth.top_right_cp2_Y, mouth.top_right_cp1_X, mouth.top_right_cp1_Y);
        // ctx.line( mouth.top_right_cp1_X, mouth.top_right_cp1_Y, mouth.rPointX, mouth.rPointY );
        // ctx.line( mouth.rPointX, mouth.rPointY, mouth.bottom_right_cp1_X, mouth.bottom_right_cp1_Y );
        // ctx.line( mouth.bottom_right_cp1_X, mouth.bottom_right_cp1_Y, mouth.bottom_right_cp2_X, mouth.bottom_right_cp2_Y);
        // ctx.line( mouth.bottom_right_cp2_X, mouth.bottom_right_cp2_Y, mouth.bottom_anchor_X, mouth.bottom_anchor_Y);
        // ctx.line( mouth.bottom_anchor_X, mouth.bottom_anchor_Y, mouth.bottom_left_cp2_X, mouth.bottom_left_cp2_Y );
        // ctx.line( mouth.bottom_left_cp2_X, mouth.bottom_left_cp2_Y, mouth.bottom_left_cp1_X, mouth.bottom_left_cp1_Y);
        // ctx.line( mouth.bottom_left_cp1_X, mouth.bottom_left_cp1_Y, mouth.lPointX, mouth.lPointY );


        //////// Lip

        ctx.line( faceCoords.lip.point1X, faceCoords.lip.point1Y, faceCoords.lip.handle1X, faceCoords.lip.handle1Y);
        ctx.line( faceCoords.lip.handle1X, faceCoords.lip.handle1Y, faceCoords.lip.point2X, faceCoords.lip.point2Y);


        //////// Chin

        ctx.line( faceCoords.chin.point1X, faceCoords.chin.point1Y, faceCoords.chin.handle1X, faceCoords.chin.handle1Y);
        ctx.line( faceCoords.chin.handle1X, faceCoords.chin.handle1Y, faceCoords.chin.point2X, faceCoords.chin.point2Y);


        //////// Inner Cheeks
        var innerCheekL = faceCoords.innerCheeks.left;
        var innerCheekR = faceCoords.innerCheeks.right;

        // Left
        ctx.line( innerCheekL.tPointX, innerCheekL.tPointY, innerCheekL.handleX, innerCheekL.handleY);
        ctx.line( innerCheekL.handleX, innerCheekL.handleY, innerCheekL.bPointX, innerCheekL.bPointY);
        // right
        ctx.line( innerCheekR.tPointX, innerCheekR.tPointY, innerCheekR.handleX, innerCheekR.handleY);
        ctx.line( innerCheekR.handleX, innerCheekR.handleY, innerCheekR.bPointX, innerCheekR.bPointY);


        //////// Outer Cheeks
        var outerCheekL = faceCoords.outerCheeks.left;
        var outerCheekR = faceCoords.outerCheeks.right;

        // Left
        ctx.line( outerCheekL.tPointX, outerCheekL.tPointY, outerCheekL.handleX, outerCheekL.handleY);
        ctx.line( outerCheekL.handleX, outerCheekL.handleY, outerCheekL.bPointX, outerCheekL.bPointY);
        // right
        ctx.line( outerCheekR.tPointX, outerCheekR.tPointY, outerCheekR.handleX, outerCheekR.handleY);
        ctx.line( outerCheekR.handleX, outerCheekR.handleY, outerCheekR.bPointX, outerCheekR.bPointY);

        ctx.setLineDash( [] );

    }
}

function drawSunface() {
    ctx.lineWidth = sunface.lines.outer;

    if ( !overlayCfg.displayOverlay ) {
        ctx.strokeStyle = faceOutlineColor;
    } else {
        ctx.strokeStyle = sunface.colours.debug.dimmed;
    }
    
    drawFace(); 
}

function updateCycle() {
    // drawFaceGimbleControl();

    if ( mouseDown ) {
        if ( !aimConstraint.target.renderConfig.isHit ) {
            aimConstraint.checkMouseHit();
        }
        
        if ( aimConstraint.target.renderConfig.isHit ) {
            aimConstraint.mouseMoveTarget();
        }
    }


    drawSunface();
    drawOverlay();
    sineWave.modulator();
    trackPlayer.updateTrackPlayer( seq, muscleModifiers );

}

function clearCanvas(ctx) {
    // cleaning
    ctx.clearRect(0, 0, canW, canH);
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );

    // blitCtx.clearRect( 0, 0, canW, canH );


    // ctx.fillStyle = 'rgba( 0, 0, 0, 0.1 )';
    // ctx.fillRect( 0, 0, canW, canH );

    // set dirty buffer
    // resetBufferClearRegion();
}

/////////////////////////////////////////////////////////////
// runtime
/////////////////////////////////////////////////////////////
function update() {

    // loop housekeeping
    runtime = undefined;

    // mouse tracking
    lastMouseX = mouseX; 
    lastMouseY = mouseY; 

    // clean canvas
    clearCanvas( ctx );

    // blending
    // if ( ctx.globalCompositeOperation != currTheme.contextBlendingMode ) {
    //     ctx.globalCompositeOperation = currTheme.contextBlendingMode;
    // }

    // updates
    updateCycle();

    // looping
    animation.state === true ? (runtimeEngine.startAnimation(runtime, update), counter++) : runtimeEngine.stopAnimation(runtime);

    // global clock
    // counter++;
}
/////////////////////////////////////////////////////////////
// End runtime
/////////////////////////////////////////////////////////////

if (animation.state !== true) {
    animation.state = true;
    update();
}

$( '.js-attachFlareCanvas' ).click( function( event ){

    if ( $( this ).hasClass( 'is-active' ) ){

        $( this ).removeClass( 'is-active' );
    
    } else {
    
        $( this ).addClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).addClass( 'attachedCanvas' ).append( lensFlareCanvas );
    
    }

} );
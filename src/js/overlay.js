var btn = {
    x: 25,
    y: 25,
    w: 125,
    h: 50,
    display: true,
    fontSize: 15,
    bg: '#666666',
    bgActive: '#aaaaaa',
    color: '#333333',
    colorActive: '#dddddd',
    content: 'Display Overlay'
};

btn.textX = btn.x + 10;
btn.textY = btn.y + ( btn.h / 2 );

function drawOverlaySwitchButton( ctx ) {
    ctx.fillStyle = btn.displayOverlay === true ? btn.bgActive : btn.bg;
    ctx.fillRect( btn.x, btn.y, btn.w, btn.h );
    ctx.fillStyle = btn.displayOverlay === true ? btn.colorActive : btn.color;
    ctx.font = btn.fontSize + 'px Tahoma';
    ctx.fillText( btn.content, btn.textX, btn.textY );
};


var overlayCfg = {
    displayOverlay: false,
    displayLookTarget: false,
    displayCentreLines: false,
    displayAnchors: false,
    displayControlPoints: false,
    displayHulls: false,
    displayGlareSpikes: false,
    displaySunToStage: false
}


module.exports.overlayBtnCfg = btn;
module.exports.drawOverlaySwitchButton = drawOverlaySwitchButton;
module.exports.overlayCfg = overlayCfg;
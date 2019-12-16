// utilities
var mathUtils = require('./../../../mathUtils.js').mathUtils;
var trig = require('./../../../trigonomicUtils.js').trigonomicUtils;

var renderFn = function renderFn(x, y, r, colorData, context) {
    var p = this;
    // console.log( 'p.render: ', p );
    var newAngle = trig.getAngleAndDistance(x, y, x + p.xVel, y + p.yVel);
    var compiledColor = "rgba(" + colorData.r + ',' + colorData.g + ',' + colorData.b + "," + colorData.a + ")";
    var endColor = "rgba(" + colorData.r + ',' + colorData.g + ',' + colorData.b + ", 0)";
    context.fillStyle = compiledColor;
    var stretchVal = mathUtils.map(p.relativeMagnitude, 0, 100, 1, 10);

    context.save();
    context.translate(x, y);
    // context.rotate( p.angle );
    context.rotate(newAngle.angle);
    context.fillEllipse(0, 0, r * stretchVal, r, context);
    context.restore();
};

module.exports.renderFn = renderFn;
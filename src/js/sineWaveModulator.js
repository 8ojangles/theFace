// sine wave modulation

var twoPi = require( './trigonomicUtils.js' ).trigonomicUtils.twoPi;

var sineWave = {
	count: 0,
	iterations: twoPi / 75,
	val: 0,
	invVal: 0
}

sineWave.modulator = function() {
	this.val = Math.sin( this.count ) / 2 + 0.5;
    this.invVal = 1 - this.val;
    this.count += this.iterations;
}

module.exports.sineWave = sineWave;
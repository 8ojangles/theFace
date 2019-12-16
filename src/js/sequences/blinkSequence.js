var expressions = require('./expressions.js');

var blinkSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.eyesClosed
};

module.exports = blinkSequence;


var expressions = require('./expressions.js');

var smilingSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.smile
};

module.exports = smilingSequence;


var expressions = require('./expressions.js');

var smileSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeOutCubic',
	members: expressions.smile
};

module.exports = smileSequence;
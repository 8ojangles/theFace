var expressions = require('./expressions.js');

var sadSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeOutCubic',
	members: expressions.sad
};

module.exports = sadSequence;
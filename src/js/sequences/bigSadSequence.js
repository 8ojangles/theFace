var expressions = require('./expressions.js');

var bigSadSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeOutCubic',
	members: expressions.bigSad
};

module.exports = bigSadSequence;
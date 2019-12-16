var expressions = require('./expressions.js');

var bigSmileSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeInOutBack',
	members: expressions.bigSmile
};

module.exports = bigSmileSequence;
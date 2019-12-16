var expressions = require('./expressions.js');

var resetSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeInOutQuad',
	members: expressions.reset
};

module.exports = resetSequence;


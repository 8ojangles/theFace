var expressions = require('./expressions.js');

var ecstaticSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'easeInOutBack',
	members: expressions.ecstatic
};

module.exports = ecstaticSequence;
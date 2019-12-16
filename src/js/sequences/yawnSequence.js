var expressions = require('./expressions.js');

var yawnIntroSequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.yawnIntro
};


var yawnMidtro1Sequence = {
	totalClock: 0,
	clock: 0,
	playing: false,
	reversePlay: false,
	easeFn: 'linearEase',
	members: expressions.yawnMidtro1
};

module.exports.yawnIntroSequence = yawnIntroSequence;
module.exports.yawnMidtro1Sequence = yawnMidtro1Sequence;

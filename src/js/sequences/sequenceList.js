var expressions = require('./expressions.js');

var smileSequence = require('./smileSequence.js');
var bigSmileSequence = require('./bigSmileSequence.js');
var ecstaticSequence = require('./ecstaticSequence.js');
var sadSequence = require('./sadSequence.js');
var bigSadSequence = require('./bigSadSequence.js');
var blinkSequence = require('./blinkSequence.js');
var resetSequence = require('./resetSequence.js');

var yawnIntroSequence = require('./yawnSequence.js').yawnIntroSequence;
var yawnMidtro1Sequence = require('./yawnSequence.js').yawnMidtro1Sequence;

var seqList = {
	smileSequence: smileSequence,
	bigSmileSequence: bigSmileSequence,
	ecstaticSequence: ecstaticSequence,
	sadSequence: sadSequence,
	bigSadSequence: bigSadSequence,
	blinkSequence: blinkSequence,
	yawnIntroSequence: yawnIntroSequence,
	yawnMidtro1Sequence: yawnMidtro1Sequence,
	resetSequence: resetSequence
};

module.exports = seqList;
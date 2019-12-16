var sequenceUtils = require( '../sequenceUtils.js');
var createSequence = sequenceUtils.createSequence;
var createTrack = sequenceUtils.createTrack;

// if sequence.dur(ation) != 1
// 		then 
// 			sequence:
// 				dur + delay(?) = 1
// if sequence.loop = true
// 		then
// 			sequence:
//				dur + delay(?) + loopDelay(?) = <= 1

var yawnIntroSequence = createSequence( {
	seq: 'yawnIntroSequence',
	dur: 0.5

} );

var yawnMidtro1Sequence = createSequence( {
	seq: 'yawnMidtro1Sequence',
	dur: 0.25

} );

var yawn = createTrack( {
	sequences: [ yawnIntroSequence, yawnMidtro1Sequence ]
} );

module.exports = yawn;

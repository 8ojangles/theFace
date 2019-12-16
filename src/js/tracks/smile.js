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

var smileSequence = createSequence( {
	seq: 'smileSequence'

} );


var smile = createTrack( {
	sequences: [ smileSequence ]
} );

module.exports = smile;

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

var sadSequence = createSequence( {
	seq: 'sadSequence'

} );


var sad = createTrack( {
	sequences: [ sadSequence ]
} );

module.exports = sad;

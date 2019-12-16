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

var bigSadSequence = createSequence( {
	seq: 'bigSadSequence'

} );


var bigSad = createTrack( {
	sequences: [ bigSadSequence ]
} );

module.exports = bigSad;

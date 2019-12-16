var easing = require( './easing.js' ).easingEquations;

var consoleInfoStyle = 'color: #aaaa00;';

var blink = require( './tracks/blink.js' );
var smile = require( './tracks/smile.js' );
var bigSmile = require( './tracks/bigSmile.js' );
var ecstatic = require( './tracks/ecstatic.js' );
var sad = require( './tracks/sad.js' );
var bigSad = require( './tracks/bigSad.js' );

var yawn = require( './tracks/yawn.js' );

var reset = require( './tracks/reset.js' );

var tracks = {
	blink: blink,
	smile: smile,
	bigSmile: bigSmile,
	ecstatic: ecstatic,
	sad: sad,
	bigSad: bigSad,
	yawn: yawn,
	reset: reset
}

var trackList = Object.keys( tracks );


function calculateLoopIterations( totalTime, loopTime, loopDelayTime ) {
	
	var counter = 0;
	var t = totalTime;

	while ( t > loopTime ) {
		t -= loopTime;
		counter++;
		if ( t > loopDelayTime ) {
			t -= loopDelayTime;
		} else {
			break;
		}
	}
	return counter;
};


function setTrackClock( time, track, sequencer ){

	var isOddNum = ( time & 1 ) ? 1 : 0;
	track.totalClock = time + isOddNum;

	var sequences = track.sequences;
	var seqLen = sequences.length - 1;

	for (var i = seqLen; i >= 0; i--) {

        var seq = sequences[i];
        var exp = sequencer.seqList[ track.sequences[ i ].seq ];
        var availableTime = 0;
        var expDur = 0;

    	seq.totalClock = track.totalClock * seq.dur;
    	seq.delayClock = track.totalClock * seq.delay;
    	seq.delayTicks = seq.delayClock;
    	seq.loopDelayTicks = track.totalClock * seq.loopDelay;

    	availableTime = seq.totalClock - seq.delayTicks;

    	if ( seq.loop === true ) {
    		seq.loopIterations = calculateLoopIterations( availableTime, seq.totalClock, seq.loopDelayTicks );
    	}
    	
    	if ( seq.returnToInit === true ) {
        	exp.totalClock = availableTime / 2;
        } else {
        	exp.totalClock = availableTime;
        }

        // console.log( 'thisSeq: ', thisSeq );
        // console.log( 'exp: ', exp );
    }
};


function setLiveExpressionProps( expression, modifiers ) {

	var memList = expression;
	var memsLen = memList.length - 1;
	
	for (var i = memsLen; i >= 0; i--) {

		var m = memList[ i ];
        var mod = modifiers[ m.name ];
        var delta = 0;
        var c = mod.curr;
        var min = mod.min;
        var max = mod.max;
        var t = m.target;

        var cNeg = c < 0 ? true : false;
        var minNeg = min < 0 ? true : false;
        var tNeg = t < 0 ? true : false;

        var tDelta = 0;

        if ( !minNeg ) {
        	tDelta = max * t;
        } else {

        	if ( !tNeg ) {
        		tDelta = max * t;
        	} else {
        		tDelta = min * -t;
        	}

        }

        delta = tDelta - c;

        m.startValue = c;
        m.valueChange = delta;

	} // for loop
};


function loadTrack( time, trackName, sequencer, modifiers ) {
	var track = this.tracks[ trackName ];
	this.setTrackClock( time, track, sequencer );
};


function startTrack( trackName ) {
	var thisTrack = this.tracks[ trackName ];
	thisTrack.playing = true;
};


function updateTrackPlayer( seq, modifiers ) {
	var thisList = this.trackList;
	thisListLen = thisList.length - 1;
	for (var i = thisListLen; i >= 0; i--) {
		this.checkTrack( this.tracks[ thisList[ i ] ], seq, modifiers );
	}
};


function checkTrack( thisTrack, seq, modifiers ){

	if ( thisTrack.playing === true ) {
		this.updateTrack( thisTrack, seq, modifiers );
	}
};


function updateTrack( thisTrack, sequencer, modifiers ) {

	if ( thisTrack.playing === true ) {
		// console.log( '------- TRACK Cycle Tick --------' );
		if ( thisTrack.clock < thisTrack.totalClock ) {
			
			thisTrack.clock++
			this.updateSequences( thisTrack, sequencer, modifiers );

		} else {
			
			if ( thisTrack.loop === true ) {
				thisTrack.clock = 0;
				// reset sequenceClocks
				// reset expressionClocks
			} else {

				stopTrack( thisTrack, sequencer );
				if ( thisTrack.linkedTrack !== null ) {
					this.loadTrack( thisTrack.totalClock, thisTrack.linkedTrack, sequencer, modifiers );
					this.startTrack( thisTrack.linkedTrack );
				}
			}

		}

	}
};


function updateSequences( thisTrack, sequencer, modifiers ) {

	var thisSeqs = thisTrack.sequences;
	var thisSeqsLen = thisSeqs.length - 1;

	for (var i = thisSeqsLen; i >= 0; i--) {
		var thisSeq = thisSeqs[ i ];
		var expression = sequencer.seqList[ thisSeq.seq ].members;

		if ( thisSeq.clock === thisSeq.delayClock ) {
			this.setLiveExpressionProps( expression, modifiers );
			thisSeq.playing = true;
		}

		if ( thisSeq.playing === true ) {
			if ( thisSeq.clock < thisSeq.totalClock ) {
				this.updateExpression( thisSeq, sequencer, modifiers );
				thisSeq.clock++;
				
				// console.log( 'thisSeq.clock: ', thisSeq.clock );
			} else {

				if ( thisSeq.loop === true ) {
					thisSeq.clock = 0;
					// resetExpression();
				} else {
					thisSeq.playing = false;
					// stopExpression();
				}

			}

		} else {

			if ( thisSeq.delay === true ) {

				if ( thisSeq.delayClock === thisTrack.clock ) {
					thisSeq.playing = true;
				}

			}

		}

	} // close for sequence[ n ] loop;
};


function updateExpression( thisSeq, sequencer, modifiers ) {

	var thisExp = sequencer.seqList[ thisSeq.seq ];
	if ( thisSeq.clock === thisSeq.delayClock ) {
		thisExp.playing = true;
	}
	
	if ( thisExp.playing === true ) {

		if ( thisExp.reversePlay === true ) {
			this.expressionRevPlay( thisExp, thisSeq, sequencer );
		} else {
			this.expressionNormalPlay( thisExp, thisSeq, sequencer );
		}

		this.updateExpressionMembers( thisExp, sequencer, modifiers );
	}
};


function updateExpressionMembers( thisExp, sequencer, modifiers ) {
	
	var thisMembers = thisExp.members;
	var thisMembersLen = thisMembers.length - 1;
	for (var i = thisMembersLen; i >= 0; i--) {
		var thisMem = thisMembers[ i ];

		// console.log( 'thisExp.easeFn: '+thisExp.easeFn+', thisExp.clock: '+thisExp.clock+', thisExp.totalClock: '+thisExp.totalClock+', thisMem.startValue: '+thisMem.startValue+', thisMem.valueChange: '+thisMem.valueChange );

		modifiers[ thisMem.name ].curr = easing[ thisExp.easeFn ]( thisExp.clock, thisMem.startValue, thisMem.valueChange, thisExp.totalClock );
		
	}
}


function expressionNormalPlay( thisExp, thisSeq, sequencer ) {

	if ( thisExp.clock < thisExp.totalClock ) {
		thisExp.clock++;

		// console.log( 'thisExp.clock: ', thisExp.clock );
	
		if ( thisExp.clock === thisExp.totalClock ) {
			if ( thisSeq.returnToInit === true ) {
				thisExp.reversePlay = true;
			}
		}

	} else {
		this.expressionCheckLoop( thisExp, thisSeq, sequencer );
	}
};


function expressionRevPlay( thisExp, thisSeq, sequencer ) {
	
	if ( thisExp.clock > 0 ) {
		thisExp.clock--;
		// console.log( 'thisExp.clock: ', thisExp.clock );
	} else {
		this.expressionCheckLoop( thisExp, thisSeq, sequencer );
	}	
};


function expressionCheckLoop( thisExp, thisSeq, sequencer ) {
	if ( thisSeq.loop === true ) {
		thisExp.playing = true;
		thisExp.reversePlay = false;
		thisSeq.clock = 0;
		// set thisSeq.loopDelay
	} else {
		thisExp.playing = false;
		thisExp.reversePlay = false;
		thisSeq.clock = 0;
	}
};


function playTrack( thisTrack ) {

	if ( thisTrack.clock < thisTrack.totalClock ) {
		this.updateClocks( thisTrack );
	} else {
		if ( thisTrack.loop === true ) {
			this.resetClocks( thisTrack );
		} else {
			this.stopTrack( thisTrack );
			this.resetClocks( thisTrack );
		}
	}
};


function stopTrack( thisTrack, sequencer ) {
	thisTrack.playing = false;
	thisTrack.clock = 0;
	
	for (var i = thisTrack.sequences.length - 1; i >= 0; i--) {
		
		var thisSeq = thisTrack.sequences[ i ];
		thisSeq.playing = false;
		thisSeq.clock = 0;

		var thisExp = sequencer.seqList[ thisSeq.seq ]; 
		thisExp.playing = false;
		thisExp.reversePlay = false;
		thisExp.clock = 0;
	}
};


function updateClocks( thisTrack ) {
	thisTrack.clock++;
	// console.log( 'thisTrack.clock: ', thisTrack.clock );
	for (var i = thisTrack.sequences.length - 1; i >= 0; i--) {
		thisTrack.sequences[ i ].clock++;
		// console.log( 'thisTrack.sequences[ i ].clock: ', thisTrack.sequences[ i ].clock ); 
	}
};


function resetClocks( thisTrack ) {
	thisTrack.clock = 0;
	for (var i = thisTrack.sequences.length - 1; i >= 0; i--) {
		thisTrack.sequences[ i ].clock = 0; 
	}
};


var trackPlayer = {

	setTrackClock: setTrackClock,
	setLiveExpressionProps: setLiveExpressionProps,
	loadTrack: loadTrack,
	startTrack: startTrack,
	stopTrack: stopTrack,
	playTrack: playTrack,
	checkTrack: checkTrack,
	updateClocks: updateClocks,
	resetClocks: resetClocks,
	updateSequences: updateSequences,
	expressionNormalPlay: expressionNormalPlay,
	expressionRevPlay: expressionRevPlay,
	expressionCheckLoop: expressionCheckLoop,
	updateExpression: updateExpression,
	updateExpressionMembers: updateExpressionMembers,
	updateTrack: updateTrack,
	updateTrackPlayer: updateTrackPlayer,
	tracks: tracks,
	trackList: trackList

}


module.exports = trackPlayer;
function expressionItem( modifier, target ) {
	return {
		name: modifier,
		target: target,
		startValue: 0,
		valueChange: 0
	}
}

function createExpression( arr ) {

	var tempArr = [];
	var arrLen = arr.length - 1;

	for (var i = arrLen; i >= 0; i--) {
		var thisItem = arr[ i ];
		tempArr.push( expressionItem( thisItem.name, thisItem.target ) );
	}
	return tempArr;
}



function createSequence( opts ) {

	var tempSeq = {

		// seq params
		returnToInit: opts.returnToInit || false,
		loop: opts.loop || false,
		repeatDelayOnLoop: opts.repeatDelayOnLoop || false,
		fadeChangeOnLoop: opts.fadeChangeOnLoop || false,
		fadeChangeOnLoopEase: opts.fadeChangeOnLoopEase || 'linearEase',
		seq: opts.seq || 'reset',

		// seq timings
		dur: opts.dur || 1,
		delay: opts.delay || 0,
		loopDelay: opts.loopDelay || 0,

		// base params
		playing: false,
		delayTicks: 0,
		loopDelayTicks: 0,

		loopIterations: 0,
		currLoopIteration: 0,
		
		loopDelayTicks: 0,
		totalClock: 0,
		delayClock: 0,
		loopDelayClock: 0,
		clock: 0	
	}

	return tempSeq;

}

function createTrack( opts ) {

	var tempTrack = {

		// track params
		loop: opts.loop || false,
		linkedTrack: opts.linkedTrack || null,
		sequences: opts.sequences || [],

		// base params
		playing: false,
		totalClock: 0,
		clock: 0,	
	}

	return tempTrack;

}

module.exports.createExpression = createExpression;
module.exports.createSequence = createSequence;
module.exports.createTrack = createTrack;
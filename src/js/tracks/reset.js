var reset = {
	playing: false,
	totalClock: 0,
	clock: 0,
	loop: false,
	linkedTrack: null,
	sequences: [
		{	
			playing: false,
			dur: 1,
			delay: 0,
			loop: false,
			loopDelay: 0,
			returnToInit: false,
			totalClock: 0,
			delayClock: 0,
			clock: 0,
			seq: 'resetSequence'
		}
	]
			
}

module.exports = reset;

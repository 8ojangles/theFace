// Track
// @type { object }

// @description
// Parent object for animation sequence or sequences.
// Defines total time (ms), current play cycle and loop config
// for a collection of sequences

// @params
// playing { boolean }: whether the track is playing on the current update cycle
// totalClock { number }: The total time (ms) for the track to be played
// clock { number }: the current clock cycle for the track
// loop { boolean }: whether the track loops
// sequences { array }: An array of sequence objects



// Sequence
// @type { object }

// @description
// Play configuration for expression. Sequences can play individually,
// in series or in parallel.

// @params
// playing { boolean }: whether the sequence is playing on the current update cycle
// dur { float }: ( min: 0, max: 1 ) The duration of the sequence defined as an index of the parent Track's totalClock
// delay { float }: ( min: 0, max: 1 ) The duration of delay before the sequence plays, defined as an index of the parent Track's totalClock
// totalClock { number }: The total time (ms) for the sequence to be played
// clock { number }: the current clock cycle for the sequence
// loop { boolean }: whether the sequence loops
// returnToInit { boolean }: whether the expression returns to its original state at the end. If true the expression's total clock will be half of the sequence's total clock. It will play in reverse for the second half of the sequences total clock.
// seq { object }: the expression object




/////////////////////////////////////////////////////////////

// updateTrackList()
	
	// 1. Loop through Track list
		// track[ n ] updateTrack()
	// 2. move to next track


// updateTrack()

	// 1. if track is playing

		// 1.a true ?

			// 2. if track.clock < track.totalClock

				// true ?

					// update track.clock
					// updateSequences( thisTrack, sequencer )

				// false ?

					// if track.loop

						// true ?

							// reset track.clock
							// reset sequence[ n ].clock
							// reset expression[ n ].clock

						// false ? 

							// set track.playing to false
							// move to next track

	// 1.b false ?



// updateSequences( thisTrack, sequencer );

	// 1. loop through track's sequence list

		// 2. if sequence[ n ] is playing

			// 2.a true ?

				// if sequence.clock < sequence.totalClock

					// true ?

						// update sequence.clock
						// updateExpressions()

					// false ?

						// check loop param

							// true ?

								// reset clock
								// resetExpression()

							// false ?

								// set sequence.playing to false
								// stopExpression()

						
			// 2.b false ?

				// if sequence.delay && if sequence.delayClock === track.clock

					// true ?

						// set sequence.playing to true

			// 3. check next sequence




// updateExpressions( thisSequence, sequencer )

	// if thisExp.playing

		// true ?

			// if thisExp.reversePlay

				// true ?
					// expressionRevPlay( thisExp, thisSequence, sequencer )

				// false ?
					// expressionNormalPlay( thisExp, thisSequence, sequencer )



// expressionRevPlay( thisExp, thisSequence, sequencer )

	// if thisExp.clock > 0
		
		// true ? 
			// thisExp.clock--
		
		// false ?
			// expressionCheckLoop( thisExp, thisSequence, sequencer )


// expressionNormalPlay( thisExp, thisSequence, sequencer )

		// if thisExp.clock < thisExp.totalClock
						
			// true ?
				// thisExp.clock++

			// false ?
				// if thisSequence.returnToInit 

					// true ?
						// set thisExp.reversePlay = true

					// false ?
						// expressionCheckLoop( thisExp, thisSequence, sequencer )



// expressionCheckLoop( thisExp, thisSequence, sequencer )
	
	// if thisSeq.loop

		// true ?
			// thisExp.reversePlay = false
			// reset thisSeq.clock
			// set thisSeq.loopDelay

		// false ?
			// thisExp.playing = false
			// reset thisSeq.clock


// 1
// create expression config
//	- expressions.js

// 2
// create expression container object
// - sequences/< sequence name >.js

// 3
// register sequence in sequenceList
// - sequences/sequenceList.js

// 4
// create track object
// - tracks/< track name >.js

// 5
// register track in trackList (tracks) object
// trackPlayer.js

// 6
// attach track to trigger (button or event)
// app.js, templates/index.html



yawn sequence

1 - intro - inhalation
	
	- eyebrows raise
	- eyes close halfway
	- mouth opens vertically wide
	- lips open



2 - midtro 1 - build up

	- mouth widens
	- mouth opens more


3 - midtro 2 - exhalation

	- frown
	- mouth closes litle
	- mouth widens



4 - outro - relax

	- everything relaxes



- timing @5 seconds
- animation graph

	0          1          2          3          4           5

T:	|-------------------------------------------------------|

1:	|------------------------------->|

2:					|--------------->|

3:							   	     |-------------->|

4:								                   |------->|
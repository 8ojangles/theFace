var proportionalMeasures = {

	setMeasures: function( baseRadius ) {

		return {
			r2: baseRadius / 2,
			r4: baseRadius / 4,
			r8: baseRadius / 8,
			r16: baseRadius / 16,
			r32: baseRadius / 32,
			r64: baseRadius / 64,
			r128: baseRadius / 128,

			r3: baseRadius / 3,
			r6: baseRadius / 6,
			r12: baseRadius / 12,
			r24: baseRadius / 24,

			r5: baseRadius / 5,
			r10: baseRadius / 10
		}
	
	}
}

module.exports = proportionalMeasures;
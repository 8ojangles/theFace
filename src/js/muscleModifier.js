var muscleModifier = {
	
	pm: {},

	getMeasures: function( measures ) {
		this.pm = measures;
	},

	setModifiers: function() {

		return {

			lookTargetX: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			lookTargetY: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			lookTargetZ: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},

			// Raises and lowers left eyebrow
			leftEyebrow: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			// Raises and lowers right eyebrow
			rightEyebrow: {
				min: -this.pm.r8, max: this.pm.r8, curr: 0
			},
			// Contracts left eyebrow muscle ( frown )
			leftBrowContract: {
				min: 0, max: this.pm.r32 + this.pm.r64, curr: 0
			},
			// Contracts right eyebrow muscle ( frown )
			rightBrowContract: {
				min: 0, max: this.pm.r32 + this.pm.r64, curr: 0
			},
			// Opens and closes left eye
			leftEye: {
				min: 0, max: 1, curr: 1
			},
			// Opens and closes right eye
			rightEye: {
				min: 0, max: 1, curr: 1
			},


			// Raises and lowers left nostril
			nostrilRaiseL: {
				min: -this.pm.r32, max: this.pm.r32, curr: 0
			},
			// Raises and lowers right nostril
			nostrilRaiseR: {
				min: -this.pm.r32, max: this.pm.r32, curr: 0
			},
			// flares left nostril
			nostrilFlareL: {
				min: 0, max: this.pm.r32, curr: 0
			},
			// flares right nostril
			nostrilFlareR: {
				min: 0, max: this.pm.r32, curr: 0
			},
			

			// raises and lowers left cheek ( pulls mouth edges up and down)
			leftCheek: {
				min: -( this.pm.r8 + this.pm.r16 ), max: this.pm.r8 + this.pm.r16, curr: 0
			},

			// raises and lowers right cheek ( pulls mouth edges up and down)
			rightCheek: {
				min: -( this.pm.r8 + this.pm.r16 ), max: this.pm.r8 + this.pm.r16, curr: 0
			},
			
			// mouth left edge pull in and out 			
			mouthEdgeLeft: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},
			// mouth right edge pull in and out 
			mouthEdgeRight: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},

			mouthEdgeLeftExtend: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},
			// mouth right edge pull in and out 
			mouthEdgeRightExtend: {
				min: -( this.pm.r16 + this.pm.r32 ), max: this.pm.r16 + this.pm.r32, curr: 0
			},
			
			// top lip left pull in and out
			topLipLeftPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// top lip right pull in and out
			topLipRightPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// bottom lip left pull in and out
			bottomLipLeftPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// bottom lip right pull in and out
			bottomLipRightPull: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// Top lip pull up and down
			topLipOpen: {
				min: 0, max: ( this.pm.r8 - this.pm.r32 ), curr: 0
			},

			// bottom lip pull up and down
			bottomLipOpen: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// lips pucker and relax
			lipsPucker: {
				min: 0, max: this.pm.r8, curr: 0
			},

			// opens and closes the jaw ( mouth )
			jawOpen: {
				min: 0, max: this.pm.r4 + this.pm.r8, curr: 0
			},
			// moves jaw laterally ( left and right )
			jawLateral: {
				min: -this.pm.r4, max: this.pm.r4, curr: 0
			}


		}

	},

	createModifiers: function( measures ) {
		this.getMeasures( measures );
		var temp = this.setModifiers();
		return temp;
	},

	setRangeInputs: function( obj ) {
		// get list of members
		var keyList = Object.keys( obj );
		// loop through member list
		for( var i = 0; i <= keyList.length - 1; i++ ) {
			// store member name
			var thisKey = keyList[ i ];
			var thisItem = obj[ thisKey ];

			if ( thisKey === 'lookTargetX' || thisKey === 'lookTargetY' || thisKey === 'lookTargetZ' ) {
				continue;
			}

			// console.log( 'thisKey: ', thisKey );
			
			$( '#'+thisKey )
				.attr( {
					'min': thisItem.min,
					'max': thisItem.max,
					'value': thisItem.curr
				} )
				.prop( {
					'min': thisItem.min,
					'max': thisItem.max,
					'value': thisItem.curr
				} )
				.closest( '.control--panel__item' )
				.find( 'output' )
				.html( thisItem.curr );

		}
	}

}

module.exports.muscleModifier = muscleModifier;
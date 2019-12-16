var easing = require('./easing.js').easingEquations;

var seqList = require('./sequences/sequenceList.js')


function computeSeqTarget( thisSeq, modifiers ){

        var getMembers = thisSeq.members;
        var getMembersLen = getMembers.length - 1;

        for ( var i = getMembersLen; i >= 0; i-- ) {

            var thisMem = getMembers[ i ];
            var getModifier = modifiers[ thisMem.name ];
            var computedTarget = 0;
            var modMin = getModifier.min;
            var modMax = getModifier.max;
            var tar = thisMem.target;

            if ( modMin === 0 ) {
                computedTarget = modMax * tar;
            } else {
                if ( modMin < 0 ) {
                    if ( tar >= 0 ) {
                        computedTarget = modMax * tar;
                    } else {
                        computedTarget = modMin * -tar;
                    }
                }
            }
            thisMem.target = computedTarget;
        } // close for i
}

function computeSeqList( modifiers ){
	var seqs = this.seqList;
	for( var seq in seqs ){
		sequencer.computeSeqTarget( seqs[ seq ], modifiers )
	}
};

function updateSequence( modifiers ){
	var mOpts = this.masterOpts;
	var seq = this.sequences;
	var seqLen = seq.length - 1;

	for (var i = seqLen - 1; i >= 0; i--) {
		var thisSeq = seq[ i ];

		if ( thisSeq.playing === true ) {
			var thisMembers = thisSeq.members;
			var thisMembersLen = thisMembers.length - 1;
			for (var i = thisMembersLen; i >= 0; i--) {
				var thisMem = thisMembers[ i ];
				
				if ( thisSeq.returnToInit === true ) {
					var tempClock = thisSeq.totalClock / 2;
				}

				modifiers[ thisMem.name ].curr = easing[ thisSeq.easeFn ]( thisSeq.clock, thisSeq.startValue, thisMem.valueChange, thisSeq.totalClock );
				
				if ( thisSeq.clock === thisSeq.totalClock ) {
					if ( thisSeq.returnToInit === false ) {
						thisSeq.playing = false;
					} else {
						var tempVal = thisSeq.startValue + thisMem.valueChange;
						var tempValChange = thisMem.valueChange * -1;
						thisSeq.startValue = tempVal;
						thisSeq.valueChange = tempValChange;
					}
				}
			}

		}
	}

}



var sequencer = {
	isActive: false,
	seqList: seqList,
	computeSeqTarget: computeSeqTarget,
	computeSeqList: computeSeqList
};

module.exports = sequencer;
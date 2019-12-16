var createExpression = require( '../sequenceUtils.js' ).createExpression;

var smile = createExpression(
	[ { name: "lookTargetX", target: "0.50" }, { name: "lookTargetY", target: "0.43" }, { name: "lookTargetZ", target: "0.67" }, { name: "leftEyebrow", target: "-0.24" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "-0.24" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "0.00" }, { name: "nostrilFlareL", target: "0.00" }, { name: "nostrilRaiseR", target: "0.00" }, { name: "nostrilFlareR", target: "0.00" }, { name: "leftCheek", target: "-0.40" }, { name: "rightCheek", target: "-0.40" }, { name: "mouthEdgeLeft", target: "-0.31" }, { name: "mouthEdgeLeftExtend", target: "-0.57" }, { name: "mouthEdgeRight", target: "0.31" }, { name: "mouthEdgeRightExtend", target: "-0.57" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.00" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "0.00" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.00" }, { name: "jawLateral", target: "0.00" } ]
);

var bigSmile = createExpression(
	[ { name: "lookTargetX", target: "0.00" }, { name: "lookTargetY", target: "0.00" }, { name: "lookTargetZ", target: "0.00" }, { name: "leftEyebrow", target: "-0.56" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "-0.56" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "-0.40" }, { name: "nostrilFlareL", target: "0.00" }, { name: "nostrilRaiseR", target: "-0.40" }, { name: "nostrilFlareR", target: "0.00" }, { name: "leftCheek", target: "-0.40" }, { name: "rightCheek", target: "-0.40" }, { name: "mouthEdgeLeft", target: "-0.59" }, { name: "mouthEdgeLeftExtend", target: "-0.40" }, { name: "mouthEdgeRight", target: "0.59" }, { name: "mouthEdgeRightExtend", target: "-0.40" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.26" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "0.59" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.00" }, { name: "jawLateral", target: "0.00" } ]
);

var ecstatic = createExpression(
	[ { name: "lookTargetX", target: "0.00" }, { name: "lookTargetY", target: "0.00" }, { name: "lookTargetZ", target: "0.00" }, { name: "leftEyebrow", target: "-1.00" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "-1.00" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "-1.00" }, { name: "nostrilFlareL", target: "1.00" }, { name: "nostrilRaiseR", target: "-1.00" }, { name: "nostrilFlareR", target: "1.00" }, { name: "leftCheek", target: "-1.00" }, { name: "rightCheek", target: "-1.00" }, { name: "mouthEdgeLeft", target: "-1.00" }, { name: "mouthEdgeLeftExtend", target: "-0.40" }, { name: "mouthEdgeRight", target: "1" }, { name: "mouthEdgeRightExtend", target: "-0.40" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.00" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "1.00" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.46" }, { name: "jawLateral", target: "0.00" } ]
);



var sad = createExpression(
	[
		{ name: 'forehead', target: 0.25 },
		{ name: 'leftEyebrow', target: 0.5 },
		{ name: 'rightEyebrow', target: 0.5 },
		{ name: 'mouthWidth', target: -0.25 },
		{ name: 'mouthExpression', target: 0.4 },
		{ name: 'mouthOpen', target: 0 },
		{ name: 'topLipOpen', target: 0 },
		{ name: 'bottomLipOpen', target: 0 },
		{ name: 'leftCheek', target: 0.5 },
		{ name: 'rightCheek', target: 0.5 }
	]
);

var bigSad = createExpression(
	[
		{ name: 'forehead', target: 0.5 },
		{ name: 'leftEyebrow', target: -0.8 },
		{ name: 'rightEyebrow', target: -0.8 },
		{ name: 'mouthWidth', target: -0.3 },
		{ name: 'mouthExpression', target: 0.8 },
		{ name: 'mouthOpen', target: 0.2 },
		{ name: 'topLipOpen', target: 0.1 },
		{ name: 'bottomLipOpen', target: 0.15 },
		{ name: 'leftCheek', target: 0.4 },
		{ name: 'rightCheek', target: 0.4 }
	]
);



var eyesClosed = createExpression(
	[
		{ name: 'leftEye', target: 0 },
		{ name: 'rightEye', target: 0 }
	]
);



var yawnIntro = createExpression(
	[
		{ name: 'leftEyebrow', target: -0.6 },
		{ name: 'rightEyebrow', target: -0.6 },
		{ name: 'mouthExpression', target: 0 },
		{ name: 'mouthBias', target: 0 },
		{ name: 'leftCheek', target: -0.25 },
		{ name: 'leftCheekPull', target: 0 },
		{ name: 'rightCheek', target: -0.25 },
		{ name: 'rightCheekPull', target: 0 },
		{ name: 'leftJowl', target: 0 },
		{ name: 'rightJowl', target: 0 }
	]
);

var yawnMidtro1 = createExpression(
	[
		{ name: 'forehead', target: 1 },
		{ name: 'leftEye', target: 0 },
		{ name: 'rightEye', target: 0 },
		{ name: 'mouthWidth', target: 0.2 },
		{ name: 'mouthOpen', target: 0.8 },
		{ name: 'mouthBias', target: 0 },
		{ name: 'topLipOpen', target: 0.5 },
		{ name: 'bottomLipOpen', target: 0.5 },
	]
);




var reset = createExpression(
	[ { name: "lookTargetX", target: "0.00" }, { name: "lookTargetY", target: "0.00" }, { name: "lookTargetZ", target: "0.00" }, { name: "leftEyebrow", target: "0.00" }, { name: "leftBrowContract", target: "0.00" }, { name: "rightEyebrow", target: "0.00" }, { name: "rightBrowContract", target: "0.00" }, { name: "leftEye", target: "1.00" }, { name: "rightEye", target: "1.00" }, { name: "nostrilRaiseL", target: "0.00" }, { name: "nostrilFlareL", target: "0.00" }, { name: "nostrilRaiseR", target: "0.00" }, { name: "nostrilFlareR", target: "0.00" }, { name: "leftCheek", target: "0.00" }, { name: "rightCheek", target: "0.00" }, { name: "mouthEdgeLeft", target: "0.00" }, { name: "mouthEdgeLeftExtend", target: "0.00" }, { name: "mouthEdgeRight", target: "0" }, { name: "mouthEdgeRightExtend", target: "0.00" }, { name: "lipsPucker", target: "0.00" }, { name: "topLipOpen", target: "0.00" }, { name: "topLipLeftPull", target: "0.00" }, { name: "topLipRightPull", target: "0.00" }, { name: "bottomLipOpen", target: "0.00" }, { name: "bottomLipLeftPull", target: "0.00" }, { name: "bottomLipRightPull", target: "0.00" }, { name: "jawOpen", target: "0.00" }, { name: "jawLateral", target: "0.00" } ]
);









var expressions = {
	smile: smile,
	bigSmile: bigSmile,
	ecstatic: ecstatic,
	sad: sad,
	bigSad: bigSad,
	yawnIntro: yawnIntro,
	yawnMidtro1: yawnMidtro1,
	eyesClosed: eyesClosed,
	reset: reset
}

module.exports = expressions;
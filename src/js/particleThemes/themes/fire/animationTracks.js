var animationTracks = [
	{
		  animName: 'radiusFade',
		  active: true,
		  param: 'r',
		  baseAmount: 'initR',
		  targetValuePath: 'tR',
		  // targetAmount: 0.00002,
		  duration: 'life',
		  easing: 'easeInExpo',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeRed',
		  active: true,
		  param: 'color4Data.r',
		  baseAmount: 'colorProfiles[0].r',
		  targetValuePath: 'colorProfiles[1].r',
		  duration: 'life',
		  easing: 'easeInOutBounce',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeGreen',
		  active: true,
		  param: 'color4Data.g',
		  baseAmount: 'colorProfiles[0].g',
		  targetValuePath: 'colorProfiles[1].g',
		  duration: 'life',
		  easing: 'easeInOutBounce',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeBlue',
		  active: true,
		  param: 'color4Data.b',
		  baseAmount: 'colorProfiles[0].b',
		  targetValuePath: 'colorProfiles[1].b',
		  duration: 'life',
		  easing: 'easeOutExpo',
		  linkedAnim: false
	},
	{
		  animName: 'color4DataChangeAlpha',
		  active: true,
		  param: 'color4Data.a',
		  baseAmount: 'colorProfiles[0].a',
		  targetValuePath: 'colorProfiles[3].a',
		  duration: 'life',
		  easing: 'easeInQuint',
		  linkedAnim: false
	}
];

module.exports.animationTracks = animationTracks;
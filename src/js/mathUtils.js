/**
* provides maths util methods.
*
* @mixin
*/

var mathUtils = {
	/**
 * @description Generate random integer between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	randomInteger: function randomInteger(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	},

	/**
 * @description Generate random float between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	random: function random(min, max) {
		if (min === undefined) {
			min = 0;
			max = 1;
		} else if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.random() * (max - min) + min;
	},

	getRandomArbitrary: function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	},
	/**
 * @description Transforms value proportionately between input range and output range.
 * @param {number} value - the value in the origin range ( min1/max1 ).
 * @param {number} min1 - minimum value in origin range.
 * @param {number} max1 - maximum value in origin range.
 * @param {number} min2 - minimum value in destination range.
 * @param {number} max2 - maximum value in destination range.
 * @param {number} clampResult - clamp result between destination range boundarys.
 * @returns {number} result.
 */
	map: function map(value, min1, max1, min2, max2, clampResult) {
		var self = this;
		var returnvalue = (value - min1) / (max1 - min1) * (max2 - min2) + min2;
		if (clampResult) return self.clamp(returnvalue, min2, max2);else return returnvalue;
	},

	/**
 * @description Clamp value between range values.
 * @param {number} value - the value in the range { min|max }.
 * @param {number} min - minimum value in the range.
 * @param {number} max - maximum value in the range.
 * @param {number} clampResult - clamp result between range boundarys.
 */
	clamp: function clamp(value, min, max) {
		if (max < min) {
			var temp = min;
			min = max;
			max = temp;
		}
		return Math.max(min, Math.min(value, max));
	}
};

module.exports.mathUtils = mathUtils;
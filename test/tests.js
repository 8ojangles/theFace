//////// setup
const seatData = require( '../src/data/seatData.js' ).seats;
const pageEls = require( '../src/js/pageElements.js' ).pageEls;
const stores = require( '../src/js/stores.js' ).stores;
const fN = require( '../src/js/functions.js' ).fN;
const mocha = require('gulp-mocha');
//////// mocha
var assert = require('assert');

function isObject(obj) {
	return obj === Object(obj);
}


//////// tests

describe('seatData', function() {
  describe('#typeOf', function() {
    it('should return an array', function() {
      assert.equal( Array.isArray( seatData ), true);
    });
  });
});


describe('pageEls', function() {
  describe('#typeOf', function() {
    it('should return an object', function() {
      assert.equal( isObject( pageEls ), true);
    });
  });
});


describe('stores', function() {
  describe('#typeOf', function() {
    it('should return an object', function() {
      assert.equal( isObject( stores ), true);
    });
  });
});



describe('checkSeatInfo', function() {
  describe('#typeOf()', function() {
    it('should return true if its a function', function() {
      var functionCheck = typeof fN.checkSeatInfo === 'function' ? true : false;
      assert.equal( functionCheck, true);
    });
  });
});


describe('checkSeatInfo', function() {
  describe('#indexOf', function() {
    it('should return false when the value is not present', function() {
      assert.equal(fN.checkSeatInfo( seatData, 'seatNumber', "6A" ), false);
    });
  });
});


describe('checkSeatInfo', function() {
  describe('#matchedData', function() {
  	var result = fN.checkSeatInfo( seatData, 'seatNumber', "1A" );
  	var resultId = result.seatNumber;
    it('should equal the seat number', function() {
      assert.equal( resultId, "1A");
    });
  });
});


describe('populateSeatInfo', function() {
  describe('#typeOf()', function() {
    it('should return true if its a function', function() {
      var functionCheck = typeof fN.populateSeatInfo === 'function' ? true : false;
      assert.equal( functionCheck, true);
    });
  });
});


describe('populateSeatInfo', function() {
  describe('#typeOf', function() {
  	var resultA = fN.checkSeatInfo( seatData, 'seatNumber', "1A" );
  	var resultB = fN.populateSeatInfo( stores.elToDataArr, resultA );
    it('should return an array', function() {
      assert.equal( Array.isArray( resultB ), true);
    });
  });
});

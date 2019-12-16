/**
* @description extends Canvas prototype with useful drawing mixins
* @kind constant
*/
var canvasDrawingApi = CanvasRenderingContext2D.prototype;

/**
* @augments canvasDrawingApi
* @description draw circle API
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.circle = function (x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
};

/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.fillCircle = function (x, y, r, context) {
	this.circle(x, y, r, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.strokeCircle = function (x, y, r) {
	this.circle(x, y, r);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.ellipse = function (x, y, w, h) {
	this.beginPath();
	for (var i = 0; i < Math.PI * 2; i += Math.PI / 16) {
		this.lineTo(x + Math.cos(i) * w / 2, y + Math.sin(i) * h / 2);
	}
	this.closePath();
};

/**
* @augments canvasDrawingApi
* @description API to draw filled ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.fillEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.strokeEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw line between 2 vector coordinates.
* @param {number} x1 - X coordinate of vector 1.
* @param {number} y1 - Y coordinate of vector 1.
* @param {number} x2 - X coordinate of vector 2.
* @param {number} y2 - Y coordinate of vector 2.
*/
canvasDrawingApi.line = function (x1, y1, x2, y2) {
	this.beginPath();
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
* @param {number} ctx - The canvas context to output.
*/
canvasDrawingApi.strokePoly = function ( x, y, r, s, ctx ) {
	
	var sides = s;
	var radius = r;
	var cx = x;
	var cy = y;
	var angle = 2 * Math.PI / sides;
	
	ctx.beginPath();
	ctx.translate( cx, cy );
	ctx.moveTo( radius, 0 );          
	for ( var i = 1; i <= sides; i++ ) {
		ctx.lineTo(
			radius * Math.cos( i * angle ),
			radius * Math.sin( i * angle )
		);
	}
	ctx.stroke();
	ctx.translate( -cx, -cy );
}

/**
* @augments canvasDrawingApi
* @description API to draw filled regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
* @param {number} ctx - The canvas context to output.
*/
canvasDrawingApi.fillPoly = function ( x, y, r, s, ctx ) {
	
	var sides = s;
	var radius = r;
	var cx = x;
	var cy = y;
	var angle = 2 * Math.PI / sides;
	
	ctx.beginPath();
	ctx.translate( cx, cy );
	ctx.moveTo( radius, 0 );          
	for ( var i = 1; i <= sides; i++ ) {
		ctx.lineTo(
			radius * Math.cos( i * angle ),
			radius * Math.sin( i * angle )
		);
	}
	ctx.fill();
	ctx.translate( -cx, -cy );
	
}
module.exports = canvasDrawingApi;
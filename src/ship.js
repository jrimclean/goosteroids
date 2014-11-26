'use strict';

var Body = require('./body.js');
var Vector = require('./vector.js');
var PolarVector = require('./polarvector.js');

function isoscelesTriangle(base, height) {
	var hypotenuse = Math.sqrt(height * height + (1.0 / 4.0) * base * base);
	var theta = Math.atan((2.0 * height) / base);
	
	var v1 = new Vector(0, 0);
	var v2 = new PolarVector(theta, hypotenuse);
	var v3 = new PolarVector(0, base);
	
	var center = v1.add(v2.add(v3)).scale(1/3); //find centroid
	
	v1 = v1.sub(center);
	v2 = v2.sub(center);
	v3 = v3.sub(center);
	
	return [ v1, v2, v3 ];
}

function Ship(position, settings) {
	Body.call(this, 1.0, position, new Vector(0, 0), settings.maxSpeed, settings.damping);
	
	this.settings = settings;
	
	this.accelerating = 0;				//equal to 1 if the ship is accelerating, 0 otherwise
	this.turning = 0;					//equal to -1 if turning counter-clockwise, 1 turning clockwise, 0 otherwise
	
	this.model = null;
	
	this.orientation = -Math.PI / 2;	//note the value is negative because we are working in screen coordinates
}

Ship.prototype = Object.create(Body.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.getModel = function() {
	if (!this.model) {
		this.model = isoscelesTriangle(this.settings.base, this.settings.height);
	}
	
	return this.model;
}

Ship.prototype.getEngineFlames = function() {
	return [];
}

Ship.prototype.update = function (physics) {
	this.orientation += this.turning * this.settings.turnRate * physics.dt;
	
	this.applyForce(new PolarVector(this.orientation, 1).scale(this.accelerating * this.settings.thrust));
	
	physics.update(this);
	
	this.clearForces();
}

Ship.prototype.render = function (graphics) {
	graphics.drawPolyLine(this.position, this.orientation - Math.PI / 2, this.getModel(), this.settings.interiorColor, this.settings.borderColor, this.settings.borderWidth, true);
}

module.exports = Ship;

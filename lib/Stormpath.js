'use strict';

var util = require('util');
var stormpath = require('stormpath');
var EventEmitter = require('events').EventEmitter;

var Stormpath = function (keyFilePath) {
	this.client = null;
	this.keyFilePath = keyFilePath;
	this.directory = null;
};

util.inherits(Stormpath, EventEmitter);

Stormpath.prototype.init = function () {
	var outerScope = this;

	if (this.client) {
		throw new Error('Client already loaded');
	}

	stormpath.loadApiKey(this.keyFilePath, function (err, apiKey) {
		outerScope.client = new stormpath.Client({apiKey: apiKey});
		if (err) {
			outerScope.emit('error', err);
		} else {
			outerScope.emit('init', outerScope.client);
		}
	});
};

Stormpath.prototype.getClient = function () {
	return this.client;
};

module.exports = Stormpath;
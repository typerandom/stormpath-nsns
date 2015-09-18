'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var ListChangeService = function (listFn, changeFn, interval) {
	this.listFn = listFn;
	this.changeFn = changeFn;
	this.interval = interval;
	this.timeoutId = null;
	this.started = false;
};

util.inherits(ListChangeService, EventEmitter);

ListChangeService.prototype._tick = function () {
	var outerScope = this;

	if (!this.started) {
		return;
	}

	this.listFn(function (err, items) {
		if (err) {
			outerScope.emit('error', err);
		} else {
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (outerScope.changeFn(item)) {
					outerScope.emit('changed', item);
				}
			}
		}

		outerScope.timeoutId = setTimeout(
			outerScope._tick.bind(outerScope),
			outerScope.interval * 1000
		);
	});
};

ListChangeService.prototype.start = function () {
	if (this.started) {
		return false;
	}

	this.started = true;
	this._tick();

	return true;
};

ListChangeService.prototype.stop = function () {
	if (!this.started) {
		return false;
	}

	this.started = false;
	clearTimeout(this.timeoutId);

	return true;
};

module.exports = ListChangeService;
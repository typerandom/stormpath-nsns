'use strict';

var util = require('util');
var Hipchatter = require('hipchatter');
var EventEmitter = require('events').EventEmitter;

var HIPCHAT_ROOM_EXIST_ERROR = "Another room exists with that name."

// Hipchatter bugs and calls the callback twice, the second time with
// a message that is just [object Object]... Ain't nobody got time for dat!
function callOnce (callback) {
	var alreadyCalled = false;
	return function () {
		if (alreadyCalled) {
			return;
		}

		alreadyCalled = true;

		var args = Array.prototype.slice.call(arguments);

		callback.apply(null, args);
	};
};

var HipChat = function (authToken) {
	this.client = new Hipchatter(authToken);
};

util.inherits(HipChat, EventEmitter);

HipChat.prototype.assertRoomCreated = function (roomName) {
	var outerScope = this;

	this.client.create_room({
		name: roomName,
		guest_access: false,
		privacy: 'private'
	}, callOnce(function (err) {
		if (err && err.message != HIPCHAT_ROOM_EXIST_ERROR) {
			outerScope.emit('error', err);
		} else {
			outerScope.emit('room_asserted', roomName);
		}
	}));
};

HipChat.prototype.sendMessage = function (roomName, message, callback) {
	var outerScope = this;
	this.client.notify(roomName, {
		message: message
	}, callOnce(function (err, result) {
		if (err) {
			outerScope.emit('error', err);
		} else {
			outerScope.emit('message_sent', message, roomName);
		}
	}));
};

module.exports = HipChat;
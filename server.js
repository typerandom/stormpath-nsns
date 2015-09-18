'use strict';

var config = require('./config');
var forever = require ('./lib/helpers/forever');
var accountHelper = require('./lib/helpers/account')

var HipChat = require('./lib/HipChat');
var Stormpath = require('./lib/Stormpath');
var AccountChangeService = require('./lib/AccountChangeService');

var hipChat = new HipChat(config.hipChat.authToken);
var stormpath = new Stormpath(config.stormpath.keyPath);

hipChat.on('error', function (err) {
	console.error("[HipChat] Error:", err);
});

hipChat.on('message_sent', function (message) {
	console.log("[HipChat] Sending message: " + message);
});

hipChat.once('room_asserted', function () {
	stormpath.on('error', function (err) {
		console.error("[Stormpath] Error:", err);
	});

	stormpath.once('init', function (client) {
		hipChat.sendMessage(config.hipChat.roomName, 'Hey, agent now running!');

		var accountChangeService = new AccountChangeService(
			client,
			config.accountChangeService.directoryUrl,
			config.accountChangeService.historySize,
			config.accountChangeService.pollInterval
		);

	    accountChangeService.on('changed', function (account) {
		    hipChat.sendMessage(
		    	config.hipChat.roomName,
		    	accountHelper.formatAsHtml(account)
		    );
	    });

		accountChangeService.start();

		forever();
	});

	stormpath.init();
});

hipChat.assertRoomCreated(config.hipChat.roomName);
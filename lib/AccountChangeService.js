'use strict';

var util = require('util');
var moment = require('moment');

var ListChangeService = require('./ListChangeService');

var AccountChangeService = function (client, directoryUrl, historySize, interval) {
	this.client = client;
	this.filterAt = null;
	this.directoryUrl = directoryUrl;
	this.historySize = historySize;
	this.previouslyVisitedHrefs = [];
	ListChangeService.apply(this, [
		this._getAccountList.bind(this),
		this._isAccountNew.bind(this),
		interval
	]);
};

util.inherits(AccountChangeService, ListChangeService);

AccountChangeService.prototype._isAccountNew = function (account) {
	var createdAt = moment(account.createdAt).utc();

	if (this.filterAt && createdAt.isBefore(this.filterAt)) {
		return false;
	}

	if (this.previouslyVisitedHrefs.indexOf(account.href) === -1) {
		this.previouslyVisitedHrefs.push(account.href);
		return true;
	}
	
	if (this.previouslyVisitedHrefs.length > this.historySize) {
		this.previouslyVisitedHrefs.shift();
	}

	return false;
};

AccountChangeService.prototype._getAccountList = function (callback) {
	var outerScope = this;

	var retrieveDirectoryAccounts = function (directory) {
		outerScope.directory.getAccounts({orderBy: 'createdAt desc', limit: 100}, function (err, result) {
			if (err) {
				callback(err);
				return;
			}

			var accounts = result.items;

			// Grab the most recently created account so that we know that we should filter
			// everything before that.
			if (outerScope.filterAt === null && accounts.length > 0) {
				outerScope.filterAt = moment(accounts[0].createdAt).add(1, 'seconds').utc();
			}

			callback(null, accounts);
		});
	};

	if (this.directory) {
		retrieveDirectoryAccounts();
	} else {
		this.client.getDirectory(this.directoryUrl, { expand: 'accounts' }, function(err, directory) {
			if (err) {
				callback(err);
				return;
			}
			
			outerScope.directory = directory;

			retrieveDirectoryAccounts();
		});
	}
};

module.exports = AccountChangeService;
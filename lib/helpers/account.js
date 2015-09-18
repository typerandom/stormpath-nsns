'use strict';

var html = require ('./html');
var gravatar = require('gravatar');

module.exports = {
	getAccountUrl: function (account) {
		var idMatches = /\/accounts\/([\w]+)$/.exec(account.href);
		return "https://api.stormpath.com/ui2/index.html#/accounts/" + idMatches[1];
	},
	formatAsHtml: function (account) {
		var accountUrl = this.getAccountUrl(account);

		var accountProfile = html.tr(html.td(html.strong("New account!")));

		accountProfile += html.tr(
			html.td(html.href(accountUrl, html.img(gravatar.url(account.email, {}, true)))) +
			html.td(html.href(accountUrl, account.fullName + " <" + account.email + ">" + html.br() + account.username))
		);

		return html.table(accountProfile);
	}
};
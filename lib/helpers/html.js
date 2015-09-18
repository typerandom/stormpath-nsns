'use strict';

module.exports = {
	href: function (url, innerHtml) {
		return "<a href='" + url + "'>" + innerHtml + "</a>";
	},
	table: function (innerHtml) {
		return "<table>" + innerHtml + "</table>";
	},
	tr: function (innerHtml) {
		return "<tr>" + innerHtml + "</tr>";
	},
	td: function (innerHtml) {
		return "<td>" + innerHtml + "</td>";
	},
	strong: function (innerHtml) {
		return "<strong>" + innerHtml + "</strong>";
	},
	br: function () {
		return "<br />";
	},
	img: function (url) {
		return "<img src='" + url + "'>";
	}
};
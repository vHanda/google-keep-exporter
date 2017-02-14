var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');
var moment = require('moment');

function parse(data) {
	var $ = cheerio.load(data);

	var note = {};
	note.content = $(".content").html();
	note.content = toMarkdown(note.content).trim();

	// FIXME: What about timezone?
	note.date = $(".heading").text().trim();
	note.date = moment(note.date).toISOString();

	note.title = $(".title").text().trim();
	note.archived = $.contains(".archived");

	note.tags = $("span.label").toArray();
	note.tags = note.tags.map(function(elem) {
		if (!elem.children) {
			return null;
		}
		return elem.children[0].data;
	});

	return note;
}

module.exports = parse;

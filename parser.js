var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');

function parse(data) {
	var $ = cheerio.load(data);

	var note = {};
	note.content = $(".content").html();
	note.content = toMarkdown(note.content).trim();

	// FIXME: Date parsing!
	note.date = $(".heading").text().trim();
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

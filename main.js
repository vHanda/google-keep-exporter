#!/usr/bin/env node

var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');
var fs = require('fs');

var data = fs.readFileSync('test.html').toString();
var $ = cheerio.load(data);

var content = $(".content").html();
content = toMarkdown(content);

console.log("Content:", content);

// FIXME: Date parsing!
var date = $(".heading").text().trim();
var title = $(".title").text().trim();

console.log("Date:", date);
console.log("Title:", title);

var archived = $.contains(".archived");
console.log("Archived:", archived);

var tags = $("span.label").toArray();
tags = tags.map(function(elem) {
    if (!elem.children) {
        return null;
    }
    return elem.children[0].data;
});

console.log("Tags:", tags);


// .content
// -> This needs to be converted to markdown
//    -> listitem
//
// Attachements -
// .attachments
// Multiple li - check for img

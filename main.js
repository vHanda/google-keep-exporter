#!/usr/bin/env node

var fs = require('fs');
var parser = require('./parser.js');

// TODO: parse argv and get directory file list
//       parse output
//

// Take notes and then convert it into markdown
//
// .content
// -> This needs to be converted to markdown
//    -> listitem
//
// Attachements -
// .attachments
// Multiple li - check for img

function generateOutputFile(note) {
	// FIXME: Check if each item actually exists!
	return `
---
title: ${note.title}
created: ${note.date}
tags: ${note.tags}
archived: ${note.archived}
---
${note.content}
`;
}

if (process.argv.length != 3) {
    console.log("Usage main.js html-file");
    process.exit(1);
}

var filePath = process.argv[2];
var data = fs.readFileSync(filePath);
var note = parser(data);

console.log(note)
console.log(generateOutputFile(note))

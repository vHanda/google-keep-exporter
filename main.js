#!/usr/bin/env node

var fs = require('fs');
var parser = require('./parser.js');
var serializer = require('./serializer.js');

// TODO: parse argv and get directory file list
//       parse output
//

// Take notes and then convert it into markdown
//
// .content
// -> This needs to be converted to markdown
//    -> listitem
//

if (process.argv.length != 3) {
    console.log("Usage main.js html-file");
    process.exit(1);
}

var filePath = process.argv[2];
var data = fs.readFileSync(filePath);
var note = parser(data);
var output = serializer.serialize(note);

if (output.length == 1) {
	var d = output[0];
	console.log(d[0]);
	fs.writeFileSync(d[0], d[1]);
}

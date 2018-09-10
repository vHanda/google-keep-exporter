#!/usr/bin/env node

var fs = require("fs");
var parser = require("./parser.js");
var serializer = require("./serializer.js");

// TODO: parse argv and get directory file list
//       parse output
//

// Take notes and then convert it into markdown
//
// .content
// -> This needs to be converted to markdown
//    -> listitem
//

if (process.argv.length != 4) {
  console.log("Usage main.js inputDir outputDir");
  process.exit(1);
}

var inputDir = process.argv[2];
var outputDir = process.argv[3];

var convert = function(filePath, outputDir) {
  var data = fs.readFileSync(filePath);
  var note = parser(data);
  var output = serializer.serialize(note);

  output.forEach(d => {
    console.log(filePath, d[0]);
    fs.writeFileSync(outputDir + "/" + d[0], d[1]);
  });
};

var files = fs.readdirSync(inputDir);
files = files.filter(t => t.endsWith(".html"));
files.forEach(filePath => convert(inputDir + "/" + filePath, outputDir));

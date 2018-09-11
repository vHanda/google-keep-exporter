#!/usr/bin/env node

var fs = require("fs");

import { parse } from "./parser";
import { serialize } from "./serializer";

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

var convert = function(filePath: string, outputDir: string) {
  var data = fs.readFileSync(filePath);
  var note = parse(data);
  var output = serialize(note);

  output.forEach(out => {
    console.log(filePath, out.fileName);
    fs.writeFileSync(outputDir + "/" + out.fileName, out.content);
  });
};

var files = fs.readdirSync(inputDir) as string[];
files = files.filter(t => t.endsWith(".html"));
files.forEach(filePath => convert(inputDir + "/" + filePath, outputDir));

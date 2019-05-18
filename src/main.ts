#!/usr/bin/env node

import * as fs from "fs";
import { parse } from "./parser";
import { serialize } from "./serializer";

import * as tmp from "tmp";
import { promisify } from "util";
var extractZip = require("extract-zip");

if (process.argv.length != 4) {
  console.log("Usage - main.js inputZip outputDir");
  console.log("or");
  console.log("Usage - main.js inputDir outputDir");

  process.exit(1);
}

var inputDir = process.argv[2];
var outputDir = process.argv[3];

main(inputDir, outputDir);

//
// Input sanitation
//
async function main(inputDir: string, outputDir: string) {
  if (!fs.existsSync(inputDir)) {
    console.log("Input file does not exist");
    process.exit(1);
  }

  var stat = fs.lstatSync(inputDir);
  if (stat.isFile() && inputDir.endsWith(".zip")) {
    const inputFile = inputDir;
    inputDir = tmp.dirSync().name;

    try {
      console.log("Unzipping ...");

      const extract = promisify(extractZip);
      await extract(inputFile, { dir: inputDir });
      inputDir += "/Takeout";
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  var files = fs.readdirSync(inputDir);
  if (files.indexOf("Keep") != -1) {
    inputDir += "/Keep";
    files = fs.readdirSync(inputDir);
  }

  //
  // Output Sanitation
  //
  try {
    fs.mkdirSync(outputDir);
  } catch (e) {}

  convertNotes(inputDir, files, outputDir);
}

function convertNotes(
  inputDir: string,
  inputFiles: string[],
  outputDir: string
) {
  const files = inputFiles.filter(t => t.endsWith(".html"));

  var notesConverted = 0;
  files.forEach(filePath => {
    var result = convertNote(inputDir + "/" + filePath, outputDir);
    if (result) {
      notesConverted += 1;
    }
  });

  console.log("Converted " + notesConverted + " notes");
  console.log("Output Dir: " + outputDir);
}

function convertNote(filePath: string, outputDir: string): boolean {
  var data = fs.readFileSync(filePath).toString();
  var note = parse(data);
  if (!note) {
    return false;
  }
  var output = serialize(note);

  output.forEach(out => {
    fs.writeFileSync(outputDir + "/" + out.fileName, out.content);
  });

  return output.length > 0;
}

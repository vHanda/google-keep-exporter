#!/usr/bin/env node

import * as fs from "fs";
import { createHash } from "crypto";
import * as path from "path";
import * as tmp from "tmp";
import { promisify } from "util";
import { parse } from "./parser";
import { serialize } from "./serializer";

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

  // Collect all html files
  var files: string[] = [];
  var folders = fs.readdirSync(inputDir);
  folders.forEach(folder => {
    folder = path.join(inputDir, folder);
    var stat = fs.lstatSync(folder);
    if (stat.isDirectory()) {
      var f = fs.readdirSync(folder);
      f = f
        .filter(filename => filename.toLowerCase().endsWith(".html"))
        .map(filename => path.join(folder, filename));

      files = files.concat(f);
    }
  });

  //
  // Output Sanitation
  //
  try {
    fs.mkdirSync(outputDir);
  } catch (e) {}

  convertNotes(files, outputDir);
}

function convertNotes(inputFilePaths: string[], outputDir: string) {
  var notesConverted = 0;
  inputFilePaths.forEach(filePath => {
    var result = convertNote(filePath, outputDir);
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
    let outputPath = path.join(outputDir, out.fileName);
    if (fs.existsSync(outputPath)) {
      const ext = path.extname(outputPath)
      const fileNameWithoutExt = out.fileName.replace(
        new RegExp(ext + '$'),
        ''
      )
      const fileHash = createHash('sha256')
      fileHash.update(out.content)
      const digest = fileHash
        .digest("base64")
        .replace(/[^A-Za-z0-9]/g, "")
        .substring(0, 4);
      const newFileName = `${fileNameWithoutExt}-${digest}${ext}`;
      outputPath = path.join(outputDir, newFileName);
    }

    fs.writeFileSync(outputPath, out.content);
  });

  return output.length > 0;
}

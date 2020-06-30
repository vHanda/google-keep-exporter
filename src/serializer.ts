var uuidV4 = require("uuid/v4");

import * as yaml from "js-yaml";
import { Note } from "./types";

const MAX_FILENAME_LENGTH = 40;

interface SerializedNote {
  fileName: string;
  content: string | Buffer;
}

export function serialize(note: Note): SerializedNote[] {
  var serializedNotes: SerializedNote[] = [];
  var mainOutput = generateOutputFile(note);

  note.attachments = note.attachments || [];
  var out = note.attachments.map(generateAttachment);
  out.forEach(a => {
    var fileName = a[0].toString();
    mainOutput += "\n![](./" + fileName + ")\n";

    serializedNotes.push({
      fileName: fileName,
      content: a[1]
    });
  });

  serializedNotes.push({
    fileName: generateFilename(note),
    content: mainOutput
  });
  return serializedNotes;
}

var generateYamlFrontMatter = function(note: Note) {
  var obj: any = JSON.parse(JSON.stringify(note));

  delete obj.content;
  delete obj.attachments;
  for (const key in obj) {
    if (!obj[key] || obj[key].length == 0) {
      delete obj[key];
    }
  }

  const ymlText = yaml.dump(obj);
  return "---\n" + ymlText + "---\n";
};

function generateOutputFile(note: Note) {
  return generateYamlFrontMatter(note) + "\n" + note.content;
}

function generateFilename(note: Note) {
  function sanitizeString(str: string) {
    var newStr = "";
    var re = /[_ßàéèäöüÄÖÜA-Za-z0-9_ ]/;
    for (var x = 0; x < str.length; x++) {
      let char = str[x];
      if (char.match(re)) {
        if (char == " ") newStr += "-";
        else newStr += char;
      }
    }
    return newStr.substring(0, MAX_FILENAME_LENGTH);
  }
  const firstLine = note.content.trim().split('\n')[0];
  return sanitizeString(
    note.title || firstLine || note.date || uuidV4())
    + ".md";
}

function generateAttachment(a: string) {
  var regex = /^data:.+\/(.+);base64,(.*)$/;
  var matches = a.substr(0, 100).match(regex);
  var ext = matches[1];
  var data = a.substr(a.indexOf("base64") + 7);
  var buffer = Buffer.from(data, "base64");
  return [uuidV4() + "." + ext, buffer];
}

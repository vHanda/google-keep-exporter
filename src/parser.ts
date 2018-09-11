var cheerio = require("cheerio");
var toMarkdown = require("to-markdown");
var moment = require("moment");

import { Note } from "./types";

function getImages(node: any) {
  var images: string[] = [];
  if (node instanceof Array) {
    node.forEach(child => {
      images = images.concat(getImages(child));
    });
    return images;
  }

  if (node.name == "img") {
    var img = node.attribs.src;
    images.push(img);
    return images;
  }

  if (!node.children) return [];

  node.children.forEach((child: any) => {
    images = images.concat(getImages(child));
  });
  return images;
}

var converter = {
  filter: "div",
  /*
    filter: function(node) {
        return node.className.indexOf('listitem') != -1;
    },
    */
  replacement: function(innerHTML: string, node: any) {
    return innerHTML + " ";
  }
};

export function parse(data: string) {
  var $ = cheerio.load(data);

  var note = {} as Note;
  note.content = $(".content").html();
  note.content = toMarkdown(note.content, { converters: [converter] }).trim();

  // FIXME: What about timezone?
  note.date = $(".heading")
    .text()
    .trim();
  note.date = moment(note.date).toISOString();

  note.title = $(".title")
    .text()
    .trim();
  note.archived = $.contains(".archived");

  note.tags = $("span.label")
    .toArray()
    .map(function(elem: any) {
      if (!elem.children) {
        return null;
      }
      return elem.children[0].data;
    });

  var attachments = $("div.attachments").toArray();
  note.attachments = getImages(attachments);

  return note;
}

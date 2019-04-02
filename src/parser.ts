import * as cheerio from "cheerio";
import { Note } from "./types";

var chrono = require("chrono-node");
var TurndownService = require("turndown");

function getImages(node: CheerioElement | CheerioElement[]) {
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

  node.children.forEach(child => {
    images = images.concat(getImages(child));
  });
  return images;
}

export function parse(data: string) {
  var $ = cheerio.load(data);

  const contentHtml = $(".content").html();
  if (!contentHtml) {
    return;
  }

  const options = {};
  var converter = new TurndownService(options);
  var md: string = converter.turndown(contentHtml);
  md = md.replace(/\u200e/g, "");
  md = md.replace(/•/g, "*");
  md = md.replace(/\*\s+/g, "* ");
  md = md.replace(/\* \u2610/g, "[ ]");
  md = md.replace(/\* \u2611/g, "[x]");
  md = md.replace(/\s+$/gm, "");

  var note = {} as Note;
  note.content = md;

  // FIXME: What about timezone?
  note.date = $(".heading")
    .text()
    .trim();
  note.date = chrono.parseDate(note.date).toISOString();

  note.title = $(".title")
    .text()
    .trim();

  note.archived = $("span.archived").length > 0;

  note.tags = $("span.label")
    .toArray()
    .map(elem => {
      if (!elem.children) {
        return null;
      }
      return elem.children[0].children[0].data;
    });

  var attachments = $("div.attachments").toArray();
  note.attachments = getImages(attachments);

  return note;
}

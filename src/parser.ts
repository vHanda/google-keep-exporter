var cheerio = require("cheerio");
var toMarkdown = require("to-markdown");
var moment = require("moment");

function getImages(node) {
  var images = [];
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

var converter = {
  filter: "div",
  /*
    filter: function(node) {
        return node.className.indexOf('listitem') != -1;
    },
    */
  replacement: function(innerHTML, node) {
    return innerHTML + " ";
  }
};

export interface Note {
    content: string;
    title: string;
    date: string;
    archived: boolean;
    tags: string[];
    attachments: string[];
}

export function parse(data) {
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

  note.tags = $("span.label").toArray().map(function(elem) {
    if (!elem.children) {
      return null;
    }
    return elem.children[0].data;
  });

  var attachments = $("div.attachments").toArray();
  note.attachments = getImages(attachments);

  return note;
}
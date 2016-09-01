#!/usr/bin/env node

var fs = require('fs');

var data = fs.readFileSync('test.html').toString();


// .content
// -> This needs to be converted to markdown
//    -> listitem
//
// Attachements -
// .attachments
// Multiple li - check for img

var fs = require('fs');
var uuidV4 = require('uuid/v4');

/**
 * Takes a note and serializes it into [(fileName, content)]
 */
var serialize = function(note) {
    // FIXME: Serialize the attachments!
    var out = note.attachments.map(generateAttachment);
    var mainOutput = generateOutputFile(note);
    out.forEach(a => {
        var fileName = a[0];
        mainOutput += '\n![](./' + fileName + ')\n';
    });
    out.push([generateFilename(note), mainOutput]);
    return out;
};


var generateYamlFrontMatter = function(note) {
    var lines = ['---'];
    for (var key in note) {
        if (!note.hasOwnProperty(key))
            continue

        if (key == 'content' || key == 'attachments')
            continue

        var val = note[key];
        if (val instanceof Array) {
            if (val.length == 0)
                continue
            val = '[' + val.join(', ') + ']';
        } else {
            val = '' + val; // convert to string
        }
        if (val.trim().length == 0 || val == 'false')
            continue

        lines.push(key + ': ' + val);
    }
    lines.push('---')

    return lines.join("\n");
}

function generateOutputFile(note) {
    return generateYamlFrontMatter(note) + '\n' + note.content;
}

function generateFilename(note) {
    function sanitizeString(str) {
        var newStr = "";
        var re = /[A-Za-z0-9- ]/;
        for (var key in str) {
            var char = str[key];
            if (char.match(re))
                if (char == ' ')
                    newStr += '-'
                else
                    newStr += char
        }
        return newStr;
    }
    return sanitizeString(note.title || note.date || uuidV4()) + '.md';
}

function generateAttachment(a) {
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = a.substr(0, 100).match(regex);
    var ext = matches[1];
    var data = a.substr(a.indexOf('base64') + 7)
    var buffer = new Buffer(data, 'base64');
    return [uuidV4() + '.' + ext, buffer];
}

module.exports = {
    serialize: serialize
};

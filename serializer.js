var fs = require('fs');
var uuidV4 = require('uuid/v4');

/**
 * Takes a note and serializes it into [(fileName, content)]
 */
var serialize = function(note) {
    // FIXME: Serialize the attachments!
    return [
        [generateFilename(note), generateOutputFile(note)]
    ];
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
        return str;
    }
    return sanitizeString(note.title || note.date || uuidV4()) + '.md';
}

module.exports = {
    serialize: serialize
};

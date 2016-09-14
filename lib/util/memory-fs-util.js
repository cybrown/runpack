var path = require('path');

function forEachFile(fs, root, cb) {
    fs.readdirSync(root).forEach(function (fileName) {
        var fileAbsolutePath = path.resolve(root, fileName);
        cb(fileAbsolutePath);
    });
};

function listFilesRecursive(fs, root) {
    var results = [];
    forEachFile(fs, root, function (absolutePath) {
        results.push(absolutePath);
    });
    return results;
}

module.exports = {
    listFilesRecursive: listFilesRecursive
};

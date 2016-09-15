var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var indexFileNames = ['index', 'main'];

module.exports = function findMainScriptFile(currentPackageInfo, supportedExtensions) {
    if (currentPackageInfo && currentPackageInfo.main) {
        var possibleMainFilePath = path.resolve(process.cwd(), currentPackageInfo.main);
        if (fs.existsSync(possibleMainFilePath)) {
            return possibleMainFilePath;
        }
    }

    return _.flatMap(indexFileNames, function(name) {
        return supportedExtensions.map(function (extension) {
            return name + extension;
        });
    }).map(function (fileName) {
        return path.resolve(process.cwd(), fileName);
    }).filter(function (filePath) {
        return fs.existsSync(filePath);
    })[0];
};

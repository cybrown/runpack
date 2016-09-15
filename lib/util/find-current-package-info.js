var path = require('path');

module.exports = function findCurrentPackageInfo() {
    try {
        return require(path.resolve(process.cwd(), 'package.json'));
    } catch (err) {
        return null;
    }
};

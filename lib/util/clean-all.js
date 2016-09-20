var del = require('del');
var path = require('path');

module.exports = function cleanAll(logger) {
    logger.verbose('Cleaning coverage');
    logger.verbose('Cleaning dist');
    logger.verbose('Cleaning test-reports');
    return del([
        path.resolve(process.cwd(), 'coverage'),
        path.resolve(process.cwd(), 'dist'),
        path.resolve(process.cwd(), 'test-reports')
    ]).catch(function (err) {
        logger.error('Error while cleaning project');
        setTimeout(function () {
            throw err;
        });
    });
}

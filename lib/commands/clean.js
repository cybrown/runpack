module.exports = function commandClean(params, logger) {
    var cleanAll = require('../util/clean-all');

    return cleanAll(logger);
};

var path = require('path');
var karma = require('karma');
var _ = require('lodash');
var runCustomCallback = require('../util/run-custom-callback');

function startKarma (customKarmaOptions, logger, karmaConfName) {
    var karmaOptions = null;
    require(path.resolve(__dirname, '../../config/karma.' + karmaConfName + '.conf.js'))({
        set: function (opts) {
            karmaOptions = opts;
        }
    });
    karmaOptions = runCustomCallback('configureKarma', karmaOptions, karma) || karmaOptions;
    var finalKarmaOptions = _.assign({}, karmaOptions, customKarmaOptions);
    finalKarmaOptions.webpack = _.assign({}, finalKarmaOptions.webpack);
    delete finalKarmaOptions.webpack.entry;
    var server = new karma.Server(finalKarmaOptions, function (exitCode) {
        if (exitCode) {
            logger.error('Karma has exited with ' + exitCode);
            process.exit(exitCode);
        }
    });
    server.start();
    return server;
}

module.exports = startKarma;

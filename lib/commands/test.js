module.exports = function commandTest(params, logger) {
    var path = require('path');
    var karma = require('karma');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');
    var runCustomCallback = require('../util/run-custom-callback');

    var withCoverage = params.coverage;
    var karmaConfig = 'test';
    var webpackConfig = 'test';
    if (withCoverage) {
        logger.verbose('Coverage enabled');
        karmaConfig = 'test-coverage';
        webpackConfig = 'test-coverage';
    }
    var Server = karma.Server;
    var karmaOptions = null;
    require(path.resolve(__dirname, '../../config/karma.' + karmaConfig + '.conf.js'))({
        set: function (opts) {
            karmaOptions = opts;
        }
    });
    karmaOptions.webpack = getWebpackConfiguration(webpackConfig);
    if (params.testReport) {
        karmaOptions.reporters.push('junit');
        karmaOptions.junitReporter = {
            outputDir: 'test-reports',
            outputFile: 'test-results.xml'
        };
    }
    delete karmaOptions.webpack.entry;
    karmaOptions = runCustomCallback('configureKarma', karmaOptions, karma) || karmaOptions;
    var server = new Server(karmaOptions, function (exitCode) {
        logger.error('Karma has exited with ' + exitCode);
        process.exit(exitCode);
    });
    server.start();
};

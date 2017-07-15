module.exports = function commandTest(params, logger) {
    var getWebpackConfiguration = require('../util/get-webpack-configuration');
    var startKarma = require('../util/start-karma');

    var withCoverage = params.coverage;
    var karmaConfig = 'test';
    var webpackConfig = 'test';
    if (withCoverage) {
        logger.verbose('Coverage enabled');
        karmaConfig = 'test-coverage';
        webpackConfig = 'test-coverage';
    }
    var karmaOptions = {
        webpack: getWebpackConfiguration(webpackConfig)
    };
    if (params.testReport) {
        if (!karmaOptions.reporters) {
            karmaOptions.reporters = [];
        }
        karmaOptions.reporters.push('junit');
        karmaOptions.junitReporter = {
            outputDir: 'test-reports',
            outputFile: 'test-results.xml'
        };
    }
    if (params.watch) {
        logger.verbose('Running tests in watch mode');
        karmaOptions.singleRun = false;
    }
    startKarma(karmaOptions, logger, karmaConfig);
};

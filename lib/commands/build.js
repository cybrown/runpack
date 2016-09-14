module.exports = function commandBuild(params, logger) {
    var path = require('path');
    var webpack = require('webpack');
    var mergeWebpackConfig = require('webpack-config-merger');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');
    var cleanAll = require('../util/clean-all');

    var env = params.env;
    var destinationDirectory = path.resolve(process.cwd(), 'dist');
    logger.verbose('Build destination directory:', destinationDirectory);
    var webpackConfig = mergeWebpackConfig(getWebpackConfiguration(env), {
        output: {
            path: destinationDirectory
        }
    });
    var compiler = webpack(webpackConfig);
    cleanAll(logger).then(function () {
        compiler.run(function (err, stats) {
            if (err) throw err;
        });
    }).catch(function (err) {
        console.error('Error');
        console.error(err);
    });
};

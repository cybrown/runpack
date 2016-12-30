module.exports = function commandServer(params, logger) {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');

    var env = params.env;
    if (params.favicon) {
        process.env.RUNPACK_FAVICON = params.favicon;
    }
    var webpackConfig = getWebpackConfiguration(env);
    var compiler = webpack(webpackConfig);
    var webpackDevServerConfig = webpackConfig.devServer;
    if (params.proxy) {
        webpackDevServerConfig.proxy = {
            '/': {
                target: params.proxy
            }
        };
    }
    var server = new WebpackDevServer(compiler, webpackDevServerConfig);
    var port = params.port || webpackConfig.devServer.port;
    server.listen(port);
    logger.verbose('Serving on http://localhost:' + port);
    if (params.test) {
        logger.verbose('Starting karma in watch mode');
        var startKarma = require('../util/start-karma');
        startKarma({
            webpack: webpackConfig,
            singleRun: false
        }, logger, 'test');
    }
};

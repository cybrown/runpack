module.exports = function commandServer(params, logger) {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');

    var env = params.env;
    var webpackConfig = getWebpackConfiguration(env);
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, webpackConfig.devServer);
    var port = params.port || webpackConfig.devServer.port;
    server.listen(port);
    logger.verbose('Serving on http://localhost:' + port);
};

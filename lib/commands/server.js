module.exports = function commandServer(params, logger) {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');
    var defaults = require('../defaults');

    var port = params.port || defaults.port;
    var env = params.env;
    var webpackConfig = getWebpackConfiguration(env);
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler);
    server.listen(port);
    logger.verbose('Serving on http://localhost:' + port);
};

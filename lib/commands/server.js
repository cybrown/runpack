module.exports = function commandServer(params, logger) {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');

    var env = params.env;
    if (params.favicon) {
        process.env.RUNPACK_FAVICON = params.favicon;
    }
    if (params.cheapSourcemap) {
        process.env.CHEAP_SOURCEMAP = 'TRUE';
    }
    if (params.input) {
        process.env.RUNPACK_INPUT = params.input;
    }
    var webpackConfig = getWebpackConfiguration(env);
    var port = params.port || webpackConfig.devServer.port;
    if (params.hot || params.hotReact) {
        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.devServer.hot = true;
        webpackConfig.entry.bundle = [
            'webpack-dev-server/client?http://0.0.0.0:' + port,
            'webpack/hot/only-dev-server',
            webpackConfig.entry.bundle
        ];
    }
    if (params.hotReact) {
        webpackConfig.entry.bundle.unshift('react-hot-loader/patch');
        webpackConfig.module.rules.filter(rule => {
            return rule.loader === 'awesome-typescript-loader' || rule.loader === 'babel-loader';
        }).forEach(rule => {
            rule.loaders = ['react-hot-loader/webpack', {
                loader: rule.loader,
                query: rule.query
            }];
            delete rule.loader;
            delete rule.query;
        });
    }
    var compiler = webpack(webpackConfig);
    var webpackDevServerConfig = webpackConfig.devServer;
    if (params.proxy) {
        webpackDevServerConfig.proxy = {};
        webpackDevServerConfig.proxy[params.proxyRoot || '/'] = {
            target: params.proxy
        };
    }
    if (params.ssl) {
        webpackDevServerConfig.https = true;
    }
    var server = new WebpackDevServer(compiler, webpackDevServerConfig);
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

var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Dotenv = require('dotenv-webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var findCurrentPackageInfo = require('./lib/find-current-package-info');
var findMainScriptFile = require('./lib/find-main-script-file');

var extensions = ['.ts', '.tsx', '.js', '.jsx'];
var currentPackageInfo = findCurrentPackageInfo();
var inputPath = process.env.RUNPACK_INPUT;
var mainScriptFile = findMainScriptFile(currentPackageInfo, extensions, inputPath);
if (!mainScriptFile) {
    throw new Error('No main javascript file defined');
}
var possibleIndexHtmlPath = path.resolve(path.dirname(mainScriptFile), 'index.html');

var webpackHtmlOptions = {};
if (fs.existsSync(possibleIndexHtmlPath)) {
    webpackHtmlOptions.template = possibleIndexHtmlPath;
}

if (process.env.RUNPACK_FAVICON) {
    webpackHtmlOptions.favicon = process.env.RUNPACK_FAVICON;
} else {
    var possibleFaviconPath = path.resolve(path.dirname(mainScriptFile), 'favicon.png');
    if (fs.existsSync(possibleFaviconPath)) {
        webpackHtmlOptions.favicon = possibleFaviconPath;
    }
}

var webpackConfig = {
    entry: {
        bundle: mainScriptFile
    },
    output: {
        filename: 'bundle.js',
        publicPath: '/',
    },
    resolve: {
        modules: [
            path.resolve(process.cwd(), 'node_modules'),
            path.resolve(__dirname, '../node_modules')
        ],
        extensions: extensions
    },
    module: {
        rules: [
            { test: /\.html$/, loader: 'html-loader', options: {interpolate: true} },
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.woff2?(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader', options: {limit: 10000, mimetype: 'application/font-woff'} },
            { test: /\.ttf(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader', options: {limit: 10000, mimetype: 'application/octet-stream'} },
            { test: /\.eot(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader', options: {limit: 10000, mimetype: 'image/svg+xml' }},
            { test: /\.(jpe?g|png|gif)$/i, use: [{loader: 'file-loader', options: {hash: 'sha512',digest: 'hex',name: '[hash].[ext]'}}, {loader: 'image-webpack-loader', options: {bypassOnDebug: true}} ] }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(webpackHtmlOptions),
        new Dotenv({
            systemvars: true
        })
    ],
    resolveLoader: {
        modules: [
            path.resolve(process.cwd(), 'node_modules'),
            path.resolve(__dirname, '../node_modules')
        ]
    },
    devServer: {
        port: 3000,
        historyApiFallback: true
    }
};

if (process.env.RUNPACK_ANALYZE) {
    webpackConfig.plugins.unshift(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false
    }));
}

if (process.env.RUNPACK_DISABLE_HOST_CHECK) {
    webpackConfig.devServer.disableHostCheck = true;
}

module.exports = webpackConfig;

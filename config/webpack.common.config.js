var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var findCurrentPackageInfo = require('./lib/find-current-package-info');
var findMainScriptFile = require('./lib/find-main-script-file');

var extensions = ['.ts', '.tsx', '.js', '.jsx'];
var currentPackageInfo = findCurrentPackageInfo();
var mainScriptFile = findMainScriptFile(currentPackageInfo, extensions);
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

module.exports = {
    entry: {
        bundle: mainScriptFile
    },
    output: {
        filename: 'bundle.js'
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
            { test: /\.html$/, loader: 'html-loader?interpolate' },
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader', query: { presets: [[require.resolve('babel-preset-es2015'), {modules: false}], require.resolve('babel-preset-es2016')], plugins: [require.resolve('babel-plugin-transform-class-properties')] } },
            { test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader', query: { presets: [require.resolve('babel-preset-react'), [require.resolve('babel-preset-es2015'), {modules: false}], require.resolve('babel-preset-es2016')], plugins: [require.resolve('babel-plugin-transform-class-properties')] } },
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.woff2?(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
            { test: /\.(jpe?g|png|gif)$/i, loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack-loader?bypassOnDebug' ] }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(webpackHtmlOptions),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [precss, autoprefixer];
                }
            }
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

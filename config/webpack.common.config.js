var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
        extensions: extensions
    },
    module: {
        rules: [
            { test: /\.html$/, loader: 'html-loader?interpolate' },
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader', query: { presets: [[require.resolve('babel-preset-es2015'), {modules: false}], require.resolve('babel-preset-es2016')] } },
            { test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader', query: { presets: [require.resolve('babel-preset-react'), [require.resolve('babel-preset-es2015'), {modules: false}], require.resolve('babel-preset-es2016')] } },
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap'}) },
            { test: /\.sass$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap'}) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap'}) },
            { test: /\.less$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap!less-loader?sourceMap'}) },
            { test: /\.woff2?(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?[.=&a-zA-Z0-9\-#]+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
            { test: /\.(jpe?g|png|gif)$/i, loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack-loader?bypassOnDebug' ] }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new HtmlWebpackPlugin(webpackHtmlOptions),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [precss, autoprefixer];
                }
            }
        })
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true
    }
};

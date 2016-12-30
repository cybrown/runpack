var fs = require('fs');
var path = require('path');

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
}

module.exports = {
    entry: mainScriptFile,
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [''].concat(extensions)
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'html?interpolate' },
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: { presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-es2016')] } },
            { test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: { presets: [require.resolve('babel-preset-react'), require.resolve('babel-preset-es2015'), require.resolve('babel-preset-es2016')] } },
            { test: /\.tsx?$/, loader: 'ts' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!postcss?sourceMap') },
            { test: /\.sass$/, loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!postcss?sourceMap!sass?sourceMap') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!postcss?sourceMap!sass?sourceMap') },
            { test: /\.less$/, loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!postcss?sourceMap!less?sourceMap') },
            { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
            { test: /\.(jpe?g|png|gif)$/i, loaders: [ 'file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false' ] }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new HtmlWebpackPlugin(webpackHtmlOptions)
    ],
    resolveLoader: {
        root: [path.resolve(__dirname, '../node_modules')]
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    devServer: {
        port: 3000,
        historyApiFallback: true
    }
};

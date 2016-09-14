var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var webpackHtmlOptions = {};

if (fs.existsSync(process.cwd() + '/index.html')) {
    webpackHtmlOptions.template = process.cwd() + '/index.html';
}

var indexFileNames = ['index', 'main'];
var extensions = ['.ts', '.tsx', '.js', '.jsx'];

const mainScriptFile = _.flatMap(indexFileNames, function(name) {
    return extensions.map(function (extension) {
        return name + extension;
    });
}).map(function (fileName) {
    return path.resolve(process.cwd(), fileName);
}).filter(function (filePath) {
    return fs.existsSync(filePath);
})[0];

if (!mainScriptFile) {
    throw new Error('No main javascript file defined');
}

module.exports = {
    entry: mainScriptFile,
    output: {
        filename: 'bundle.[hash].js'
    },
    resolve: {
        extensions: [''].concat(extensions)
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'html' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-es2016')] } },
            { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel', query: { presets: [require.resolve('babel-preset-react'), require.resolve('babel-preset-es2015'), require.resolve('babel-preset-es2016')] } },
            { test: /\.tsx?$/, loader: 'ts' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
            { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
            { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
            { test: /\.(jpe?g|png|gif)$/i, loaders: [ 'file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false' ] }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.[hash].css', {
            allChunks: true
        }),
        new HtmlWebpackPlugin(webpackHtmlOptions)
    ],
    resolveLoader: {
        root: [path.resolve(__dirname, '../node_modules')]
    },
    postcss: function () {
        return [precss, autoprefixer];
    }
};

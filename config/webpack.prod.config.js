var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');
var WebpackStableModuleIdAndHash = require('webpack-stable-module-id-and-hash');
var OptimizeCssAssetsPlugin  = require('optimize-css-assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpackConfiguration = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap'}) },
            { test: /\.sass$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap'}) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap'}) },
            { test: /\.less$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!postcss-loader?sourceMap!less-loader?sourceMap'}) },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                const userRequest = module.userRequest;
                return userRequest && /[\\/]node_modules[\\/]/.test(userRequest);
            }
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
});

module.exports = webpackConfiguration;

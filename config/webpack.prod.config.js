var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');
var WebpackStableModuleIdAndHash = require('webpack-stable-module-id-and-hash');
var OptimizeCssAssetsPlugin  = require('optimize-css-assets-webpack-plugin');

var webpackConfiguration = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        filename: '[name].[chunkhash].js'
    },
    plugins: [
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
        new webpack.HashedModuleIdsPlugin()
    ]
});

webpackConfiguration.plugins[0].filename = '[name].[contenthash].css';

module.exports = webpackConfiguration;

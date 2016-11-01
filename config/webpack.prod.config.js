var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');

var webpackConfiguration = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        filename: 'bundle.[hash].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
});

webpackConfiguration.plugins[0].filename = 'style.[hash].css';

module.exports = webpackConfiguration;
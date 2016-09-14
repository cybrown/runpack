var mergeWebpackConfig = require('webpack-config-merger');

module.exports = mergeWebpackConfig(require('./webpack.test.config'), {
    devtool: 'inline-source-map',
    module: {
        postLoaders: [{
            test: /\.(j|t)sx?$/,
            loader: 'istanbul-instrumenter-loader',
            exclude: [
                /\.test\.(j|t)sx?$/,
                /node_modules/
            ]
        }]
    }
});

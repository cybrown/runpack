var mergeWebpackConfig = require('webpack-config-merger');

module.exports = mergeWebpackConfig(require('./webpack.dev.config'), {
    devtool: 'inline-source-map',
    module: {
        preLoaders: [{
            test: /\.(j|t)sx?$/,
            loader: 'source-map-loader',
            exclude: [/node_modules/]
        }]
    }
});

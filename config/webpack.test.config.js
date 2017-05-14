var mergeWebpackConfig = require('webpack-config-merger');

module.exports = mergeWebpackConfig(require('./webpack.dev.config'), {
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.(j|t)sx?$/,
            enforce: 'pre',
            loader: 'source-map-loader',
            exclude: [/node_modules/]
        }]
    }
});

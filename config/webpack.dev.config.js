var mergeWebpackConfig = require('webpack-config-merger');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var webpack = require('webpack');

var sourceMapConfiguration = 'source-map';

if (process.env.CHEAP_SOURCEMAP) {
    sourceMapConfiguration = 'cheap-module-eval-source-map';
}

module.exports = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        devtoolModuleFilenameTemplate: "[resource]",
        devtoolFallbackModuleFilenameTemplate: "[resource]?[hash]"
    },
    module: {
        rules: [
            { test: /\.css$/, loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap' },
            { test: /\.sass$/, loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap' },
            { test: /\.scss$/, loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap' },
            { test: /\.less$/, loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap!less-loader?sourceMap' },
        ]
    },
    devtool: sourceMapConfiguration,
    plugins: [
        new LiveReloadPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.NamedModulesPlugin()
    ]
});

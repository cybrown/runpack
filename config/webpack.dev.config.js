var mergeWebpackConfig = require('webpack-config-merger');
var LiveReloadPlugin = require('webpack-livereload-plugin');

var sourceMapConfiguration = 'source-map';

if (process.env.CHEAP_SOURCEMAP) {
    sourceMapConfiguration = 'cheap-module-eval-source-map';
}

module.exports = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        devtoolModuleFilenameTemplate: "[resource]",
        devtoolFallbackModuleFilenameTemplate: "[resource]?[hash]"
    },
    devtool: sourceMapConfiguration,
    debug: true,
    plugins: [new LiveReloadPlugin()]
});

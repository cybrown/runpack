var mergeWebpackConfig = require('webpack-config-merger');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        devtoolModuleFilenameTemplate: "[resource]",
        devtoolFallbackModuleFilenameTemplate: "[resource]?[hash]"
    },
    devtool: 'source-map',
    debug: true,
    plugins: [new LiveReloadPlugin()]
});

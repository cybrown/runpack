var mergeWebpackConfig = require('webpack-config-merger');
var webpack = require('webpack');
var postcssConfig = require('./postcss.config.js');

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
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMaps: true,
                        plugins: postcssConfig
                    }
                }]
            },
            {
                test: /\.sass$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMaps: true,
                        plugins: postcssConfig
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMaps: true
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMaps: true,
                        plugins: postcssConfig
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMaps: true
                    }
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMaps: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMaps: true,
                        plugins: postcssConfig
                    }
                }, {
                    loader: 'less-loader',
                    options: {
                        sourceMaps: true
                    }
                }]
            },
        ]
    },
    devtool: sourceMapConfiguration,
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.NamedModulesPlugin()
    ]
});

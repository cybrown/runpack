var mergeWebpackConfig = require('webpack-config-merger');
var webpack = require('webpack');
var postcssConfig = require('./postcss.config.js');
var babelConf = require('./babel.conf');

var sourceMapConfiguration = 'source-map';

if (process.env.CHEAP_SOURCEMAP) {
    sourceMapConfiguration = 'cheap-module-eval-source-map';
}

module.exports = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        devtoolModuleFilenameTemplate: "[resource]",
        devtoolFallbackModuleFilenameTemplate: "[resource]?[hash]"
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        postcssOptions: postcssConfig
                    }
                }]
            },
            {
                test: /\.sass$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        postcssOptions: postcssConfig
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        postcssOptions: postcssConfig
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        postcssOptions: postcssConfig
                    }
                }, {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: babelConf.babelConfiguration
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: babelConf.babelConfigurationReact
            },
        ]
    },
    devtool: sourceMapConfiguration,
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        ...(!process.env.RUNPACK_VERBOSE ? [new webpack.ProgressPlugin()] : []),
    ]
});

if (!process.env.RUNPACK_VERBOSE) {
    module.exports.devServer.noInfo = true;
}

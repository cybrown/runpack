var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');
var OptimizeCssAssetsPlugin  = require('optimize-css-assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var postcssConfig = require('./postcss.config.js');
var babelConf = require('./babel.conf');

var webpackConfiguration = mergeWebpackConfig(require('./webpack.common.config'), {
    output: {
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader?sourceMap',
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig
                        }
                    }]
                })
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader?sourceMap',
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader?sourceMap',
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader?sourceMap',
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig
                        }
                    }, {
                        loader: 'less-loader'
                    }]
                })
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: babelConf.babelConfiguration
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: babelConf.babelConfigurationReact
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            allChunks: true
        }),
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
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
});

module.exports = webpackConfiguration;

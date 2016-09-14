var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');
var runCustomCallback = require('./run-custom-callback');

module.exports = function getWebpackConfiguration(env) {
    var webpackConfiguration = require('../../config/webpack.' + env + '.config');
    webpackConfiguration = runCustomCallback('configureWebpack', webpackConfiguration, webpack, mergeWebpackConfig) || webpackConfiguration;
    return webpackConfiguration;
};

var babelConfiguration = {
    presets: [
        [require.resolve('babel-preset-es2015'), {modules: false}],
        require.resolve('babel-preset-es2016')
    ],
    plugins: [
        require.resolve('babel-plugin-transform-class-properties'),
        require.resolve('babel-plugin-syntax-dynamic-import'),
        require.resolve('babel-plugin-transform-object-rest-spread')
    ]
};

var babelConfigurationReact = Object.assign({}, babelConfiguration, {
    presets: babelConfiguration.presets.concat(require.resolve('babel-preset-react'))
});

module.exports.babelConfiguration = babelConfiguration;
module.exports.babelConfigurationReact = babelConfigurationReact;

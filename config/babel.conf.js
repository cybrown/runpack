var babelConfiguration = {
    presets: [
        [require.resolve('@babel/preset-env'), {modules: false}],
    ],
    plugins: [
        require.resolve('@babel/plugin-proposal-class-properties'),
    ]
};

var babelConfigurationReact = Object.assign({}, babelConfiguration, {
    presets: babelConfiguration.presets.concat(require.resolve('@babel/preset-react'))
});

module.exports.babelConfiguration = babelConfiguration;
module.exports.babelConfigurationReact = babelConfigurationReact;

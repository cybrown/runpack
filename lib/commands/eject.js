module.exports = function (params, logger) {
    var fs = require('fs');
    var path = require('path');
    var ncp = require('ncp');
    var child_process = require('child_process');
    var Promise = require('es6-promise-polyfill').Promise;
    var packageJson = require('../../package.json');

    var devDependencies = [
        'autoprefixer',
        'babel-core',
        'babel-loader',
        'babel-preset-es2015',
        'babel-preset-es2016',
        'babel-preset-react',
        'css-loader',
        'extract-text-webpack-plugin',
        'file-loader',
        'html-loader',
        'html-webpack-plugin',
        'image-webpack-loader',
        'istanbul-instrumenter-loader',
        'json-loader',
        'karma',
        'karma-coverage',
        'karma-junit-reporter',
        'karma-mocha',
        'karma-phantomjs-launcher',
        'karma-sourcemap-loader',
        'karma-webpack',
        'less',
        'less-loader',
        'lodash',
        'mocha',
        'postcss-loader',
        'precss',
        'raw-loader',
        'source-map-loader',
        'style-loader',
        'ts-loader',
        'typescript',
        'url-loader',
        'webpack',
        'webpack-config-merger',
        'webpack-dev-server',
    ].map(function (depName) {
        return depName + '@' + packageJson.dependencies[depName];
    });

    var karmaConfJsContent = [
        'module.exports = function (config) {',
        '  var baseConfig;',
        '  require(\'./config/karma.test.conf.js\')({',
        '    set: function (c) { baseConfig = c; }',
        '  });',
        '  baseConfig.webpack = require(\'./config/webpack.test.config.js\');',
        '  config.set(baseConfig);',
        '};'
    ].join('');

    var webpackConfigJsContent = 'module.exports = require(\'./config/webpack.dev.config\');';

    new Promise(function (resolve, reject) {
        logger.verbose('Writing karma.conf.js');
        fs.writeFile(
            path.resolve(process.cwd(), 'karma.conf.js'),
            karmaConfJsContent,
            { encoding: 'utf8' },
            function (err) {
                if (err) {
                    logger.error('Error while writing karma.conf.js');
                    return reject(err);
                }
                resolve();
            });
    }).then(function () {
        return new Promise(function (resolve, reject) {
            logger.verbose('Writing webpack.config.js');
            fs.writeFile(
                path.resolve(process.cwd(), 'webpack.config.js'),
                webpackConfigJsContent,
                { encoding: 'utf8' },
                function (err) {
                    if (err) {
                        logger.error('Error while writing webpack.config.js');
                        return reject(err);
                    }
                    resolve();
                });
        })
    }).then(function () {
        return new Promise(function (resolve, reject) {
            logger.verbose('Copying configuration files');
            ncp(path.resolve(__dirname, '..', '..', 'config'), path.resolve(process.cwd(), 'config'), function (err) {
                if (err) {
                    logger.error('Error while ejecting');
                    return reject(err);
                }
                resolve();
            });
        })
    }).then(function () {
        return new Promise(function (resolve, reject) {
            logger.verbose('Writing npm scripts');
            var packageJsonPath = path.resolve(process.cwd(), 'package.json');
            fs.readFile(packageJsonPath, { encoding: 'utf8' }, function (err, data) {
                if (err) {
                    logger.error('Error reading package.json file');
                    return reject(err);
                }
                packageJson = JSON.parse(data);
                packageJson.scripts = packageJson.scripts || {};
                if (packageJson.scripts.start ||
                    packageJson.scripts.dist ||
                    (packageJson.scripts.test && packageJson.scripts.test !== "echo \"Error: no test specified\" && exit 1")) {
                    throw new Error('The "start", "test" and "dist" npm scripts need to be empty, move them then run eject again.');
                }
                packageJson.scripts.start = 'webpack-dev-server --port 3000';
                packageJson.scripts.test = 'karma start --single-run';
                packageJson.scripts.dist = 'webpack --config config/webpack.prod.config.js --output-path dist';
                fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), { encoding: 'utf8' }, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        })
    }).then(function () {
        return new Promise(function (resolve, reject) {
            if (params.skipNpmInstall) {
                logger.verbose('Skipping dev dependencies installation');
                return resolve();
            }
            logger.verbose('Installing dev dependencies');
            var child = child_process.spawn('npm', ['install', '--save-dev'].concat(devDependencies), { shell: true });
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
            var errorsDuringNpmInstall = false;
            child.on('close', function () {
                if (!errorsDuringNpmInstall) {
                    logger.verbose('Finished install dev dependencies');
                    resolve();
                }
            });
            child.on('error', function (err) {
                errorsDuringNpmInstall = true;
                logger.error('Error in spawning npm');
                reject(err);
            });
        })
    }).then(function () {
        logger.verbose('Eject completed');
    }).catch(function (err) {
        logger.error('Error while ejecting');
        throw err;
    });
};

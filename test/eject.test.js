var path = require('path');
var del = require('del');
var fs = require('fs');
var runCli = require('./helpers').runCli;
var ncp = require('ncp');
var expect = require('chai').expect;
var Promise = require('es6-promise-polyfill').Promise;

var packageJson = require(path.resolve(process.cwd(), 'package.json'));
var binPath = path.resolve(process.cwd(), packageJson.bin);

describe ('eject', function () {

    var originalCwd = process.cwd();

    describe ('tests on project-with-package.json', function () {

        before(function () {
            return new Promise(function (resolve, reject) {
                ncp(path.resolve('test-samples', 'project-with-package.json'), path.resolve('.tmp-test'), function (err) {
                    if (err) return reject(err);
                    resolve();
                });
            }).then(function () {
                process.chdir('.tmp-test');
                return runCli(binPath, ['eject', '--skip-npm-install']);
            });
        });

        it ('should write webpack.config.js', function (done) {
            fs.stat('webpack.config.js', function (err, stats) {
                if (err) return done(err);
                expect(stats.isFile()).to.equal(true);
                done();
            });
        });

        it ('should write karma.conf.js', function (done) {
            fs.stat('karma.conf.js', function (err, stats) {
                if (err) return done(err);
                expect(stats.isFile()).to.equal(true);
                done();
            });
        });

        it ('should copy config directory', function (done) {
            fs.stat('config', function (err, stats) {
                if (err) return done(err);
                expect(stats.isDirectory()).to.equal(true);
                done();
            });
        });

        it ('should write npm scripts', function () {
            var packageInfo = require(path.resolve(process.cwd(), './package.json'));
            expect(packageInfo.scripts.start).to.equal('webpack-dev-server --port 3000');
            expect(packageInfo.scripts.test).to.equal('karma start --single-run');
            expect(packageInfo.scripts.dist).to.equal('webpack --config config/webpack.prod.config.js --output-path dist');
        });

        after(function () {
            process.chdir(originalCwd);
            return del(path.resolve(originalCwd, '.tmp-test'));
        });
    });
});

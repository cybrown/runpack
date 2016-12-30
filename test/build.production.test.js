var assertFile = require('./helpers').assertFile;
var assertFileNonExistant = require('./helpers').assertFileNonExistant;
var assertIndexHtmlBodyMinified = require('./helpers').assertIndexHtmlBodyMinified;
var assertBundleJsBodyMinified = require('./helpers').assertBundleJsBodyMinified;
var assertStyleCssBodyMinified = require('./helpers').assertStyleCssBodyMinified;
var runBuild = require('./helpers').runBuild;
var expect = require('chai').expect;
var path = require('path');
var del = require('del');

describe ('build with production files', function () {

    var originalCwd = process.cwd();

    beforeEach(function () {
        process.chdir(originalCwd);
    });

    describe ('tests on project1', function () {

        before(runBuild('project1', ['-e', 'prod']));

        after(function () {
            return del(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist'));
        });

        var hash = null;

        it ('should write index.html', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'index.html'))
                .then(function (body) {
                    hash = body.match(/bundle\.([a-f0-9]{20})\.js/)[1];
                    return body;
                })
                .then(assertIndexHtmlBodyMinified);
        });

        it ('should write bundle.js', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'bundle.' + hash + '.js'))
                .then(assertBundleJsBodyMinified);
        });

        it ('should write style.css', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'style.' + hash + '.css'))
                .then(assertStyleCssBodyMinified);
        });

        it ('should not write bundle.js.map', function () {
            return assertFileNonExistant(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'bundle.' + hash + '.js.map'));
        });

        it ('should not write style.css.map', function () {
            return assertFileNonExistant(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'style.' + hash + '.css.map'));
        });
    });

    describe ('tests on favicon', function () {

        before(runBuild('favicon', ['-e', 'prod', '--favicon', path.resolve(process.cwd(), 'test-samples', 'favicon', 'images', 'favicon.png')]));

        after(function () {
            return del(path.resolve(process.cwd(), 'test-samples', 'favicon', 'dist'));
        });

        it ('should emit a favicon', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'favicon', 'dist', 'index.html'))
                .then(function (body) {
                    expect(body).to.match(/<link rel="shortcut icon" href="favicon\.png"><\/head>/);
                });
        });
    });
});

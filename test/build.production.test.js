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

        var jsHash = null;
        var cssHash = null;

        it ('should write index.html', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'index.html'))
                .then(function (body) {
                    jsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    cssHash = body.match(/bundle\.([a-f0-9]{20})\.css/)[1];
                    return body;
                })
                .then(assertIndexHtmlBodyMinified);
        });

        it ('should write bundle.js', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'bundle.' + jsHash + '.js'))
                .then(assertBundleJsBodyMinified);
        });

        it ('should write bundle.css', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'bundle.' + cssHash + '.css'))
                .then(assertStyleCssBodyMinified);
        });

        it ('should not write bundle.js.map', function () {
            return assertFileNonExistant(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'bundle.' + jsHash + '.js.map'));
        });

        it ('should not write bundle.css.map', function () {
            return assertFileNonExistant(path.resolve(process.cwd(), 'test-samples', 'project1', 'dist', 'bundle.' + cssHash + '.css.map'));
        });
    });

    describe ('tests on project1 with custom output directory', function () {

        before(runBuild('project1', ['-e', 'prod', '-o', 'target']));

        after(function () {
            return del(path.resolve(process.cwd(), 'test-samples', 'project1', 'target'));
        });

        var jsHash = null;
        var cssHash = null;

        it ('should write index.html', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'target', 'index.html'))
                .then(function (body) {
                    jsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    cssHash = body.match(/bundle\.([a-f0-9]{20})\.css/)[1];
                    return body;
                })
                .then(assertIndexHtmlBodyMinified);
        });

        it ('should write bundle.js', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'target', 'bundle.' + jsHash + '.js'))
                .then(assertBundleJsBodyMinified);
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
                    expect(body).to.match(/<link rel="icon" href="\/favicon\.png">/);
                });
        });
    });

    describe ('tests on favicon-default', function () {

        before(runBuild('favicon-default', ['-e', 'prod']));

        after(function () {
            return del(path.resolve(process.cwd(), 'test-samples', 'favicon-default', 'dist'));
        });

        it ('should emit a favicon', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'favicon-default', 'dist', 'index.html'))
                .then(function (body) {
                    expect(body).to.match(/<link rel="icon" href="\/favicon\.png">/);
                });
        });
    });

    describe ('tests on project-with-node_modules', function () {

        before(runBuild('project-with-node_modules', ['-e', 'prod']));

        after(() => del(path.resolve(process.cwd(), 'test-samples', 'project-with-node_modules', 'dist')));

        var bundleJsHash = null;
        var vendorJsHash = null;
        var bundleCssHash = null;
        var vendorCssHash = null;

        it ('should emit index.html with 4 files', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-node_modules', 'dist', 'index.html'))
                .then(body => {
                    bundleJsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    vendorJsHash = body.match(/vendor\.([a-f0-9\-]{20})\.js/)[1];
                    bundleCssHash = body.match(/bundle\.([a-f0-9]{20})\.css/)[1];
                    vendorCssHash = body.match(/vendor\.([a-f0-9]{20})\.css/)[1];
                    return body;
                });
        });

        it ('should emit bundle.js', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-node_modules', 'dist', 'bundle.' + bundleJsHash + '.js'))
                .then(body => expect(body).to.match(/custom lib/));
        });

        it ('should emit bundle.css', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-node_modules', 'dist', 'bundle.' + bundleCssHash + '.css'))
                .then(body => expect(body).to.match(/custom-style/));
        });

        it ('should emit vendor.js', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-node_modules', 'dist', 'vendor.' + vendorJsHash + '.js'))
                .then(body => expect(body).to.match(/dummy jquery/));
        });

        it ('should emit vendor.css', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-node_modules', 'dist', 'vendor.' + vendorCssHash + '.css'))
                .then(body => expect(body).to.match(/dummy-jquery-css/));
        });
    });

    describe ('Escape CSS', function () {

        before(runBuild('escape-css', ['-e', 'prod']));

        after(() => del(path.resolve(process.cwd(), 'test-samples', 'escape-css', 'dist')));

        var bundleCssHash = null;

        it ('should emit index.html', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'escape-css', 'dist', 'index.html'))
                .then(body => {
                    bundleCssHash = body.match(/bundle\.([a-f0-9]{20})\.css/)[1];
                    return body;
                });
        });

        it ('should escape css caracters', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'escape-css', 'dist', 'bundle.' + bundleCssHash + '.css'))
                .then(body => expect(body).to.match(/\\A/));
        });
    });

    describe ('Tree shacking with Babel', function () {

        before(runBuild('tree-shaking-babel', ['-e', 'prod']));

        after(() => del(path.resolve(process.cwd(), 'test-samples', 'tree-shaking-babel', 'dist')));

        var bundleJsHash = null;

        it('should emit index.html', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'tree-shaking-babel', 'dist', 'index.html'))
                .then(body => {
                    bundleJsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    return body;
                });
        });

        it ('should not bundle unused exports', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'tree-shaking-babel', 'dist', 'bundle.' + bundleJsHash + '.js'))
                .then(body => {
                    expect(/this should be bundled/.test(body)).to.be.ok;
                    expect(/this should not be bundled/.test(body)).to.be.false;
                    expect(body.length).to.be.below(1001);
                });
        });
    });

    describe ('Tree shacking with Typescript', function () {

        before(runBuild('tree-shaking-typescript', ['-e', 'prod']));

        after(() => del(path.resolve(process.cwd(), 'test-samples', 'tree-shaking-typescript', 'dist')));

        var bundleJsHash = null;

        it('should emit index.html', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'tree-shaking-typescript', 'dist', 'index.html'))
                .then(body => {
                    bundleJsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    return body;
                });
        });

        it('should not bundle unused exports', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'tree-shaking-typescript', 'dist', 'bundle.' + bundleJsHash + '.js'))
                .then(body => {
                    expect(/this should be bundled/.test(body)).to.be.ok;
                    expect(/this should not be bundled/.test(body)).to.be.false;
                });
        });
    });

    describe ('ES6 dependencies', function () {

        before(runBuild('project-with-es6-dep', ['-e', 'prod']));

        after(() => del(path.resolve(process.cwd(), 'test-samples', 'project-with-es6-dep', 'dist')));

        var vendorJsHash = null;

        it('should transpile es6 dependencies for production', () => {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-es6-dep', 'dist', 'index.html'))
                .then(body => {
                    vendorJsHash = body.match(/vendor\.([a-f0-9\-]{20})\.js/)[1];
                    return assertFile(path.resolve(process.cwd(), 'test-samples', 'project-with-es6-dep', 'dist', 'vendor.' + vendorJsHash + '.js'));
                })
                .then(body => {
                    expect(/console\.log\(["']this is a dummy dependency["']\)/.test(body)).to.be.ok;
                });
        });
    });
});

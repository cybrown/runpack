var assertResource = require('./helpers').assertResource;
var assertIndexHtmlBodyMinified = require('./helpers').assertIndexHtmlBodyMinified;
var assertBundleJsBodyMinified = require('./helpers').assertBundleJsBodyMinified;
var assertStyleCssBodyMinified = require('./helpers').assertStyleCssBodyMinified;
var startServer = require('./helpers').startServer;
var stopServer = require('./helpers').stopServer;
var expect = require('chai').expect;


describe ('server with production files', function () {

    var originalCwd = process.cwd();

    beforeEach(function () {
        process.chdir(originalCwd);
    });

    describe ('tests on project1', function () {

        before(startServer('project1', ['-e', 'prod']));

        after(stopServer);

        var jsHash = null;
        var cssHash = null;

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    jsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    cssHash = body.match(/bundle\.([a-f0-9]{20})\.css/)[1];
                    return body;
                })
                .then(assertIndexHtmlBodyMinified);
        });

        it ('should serve bundle.js', function () {
            return assertResource('/bundle.' + jsHash + '.js')
                .then(assertBundleJsBodyMinified);
        });

        it ('should serve bundle.css', function () {
            return assertResource('/bundle.' + cssHash + '.css')
                .then(assertStyleCssBodyMinified);
        });

        it ('should not serve bundle.js.map', function () {
            return assertResource('/bundle.' + jsHash + '.js.map', 404);
        });

        it ('should not serve bundle.css.map', function () {
            return assertResource('/bundle.' + cssHash + '.css.map', 404);
        });
    });

    describe ('CSS hash in URL', function () {

        before(startServer('css-url-hash', ['-e', 'prod']));

        after(stopServer);

        var cssHash = null;

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    cssHash = body.match(/vendor\.([a-f0-9]{20})\.css/)[1];
                    return body;
                });
        });

        it ('should escape css caracters', function () {
            return assertResource('/vendor.' + cssHash + '.css')
                .then(body => expect(body).to.match(/\.eot/));
        });
    });

    describe ('tests on project-with-sass', function () {

        before(startServer('project-with-sass', ['-e', 'prod']));

        after(stopServer);

        var cssHash = null;

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    expect(body).match(/^<!DOCTYPE html>/);
                    cssHash = body.match(/bundle\.([a-f0-9]{20})\.css/)[1];
                });
        });

        it ('should serve bundle.css', function () {
            return assertResource('/bundle.' + cssHash + '.css')
                .then(function (body) {
                    expect(body).match(/body h1{/);
                    expect(body).match(/background-color:red/);
                    expect(body).match(/body h2{/);
                    expect(body).match(/background-color:#00f/);
                });
        });
    });
});

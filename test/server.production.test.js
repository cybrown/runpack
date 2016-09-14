var assertResource = require('./helpers').assertResource;
var assertIndexHtmlBody = require('./helpers').assertIndexHtmlBody;
var assertBundleJsBodyMinified = require('./helpers').assertBundleJsBodyMinified;
var assertStyleCssBodyMinified = require('./helpers').assertStyleCssBodyMinified;
var startServer = require('./helpers').startServer;
var stopServer = require('./helpers').stopServer;


describe ('server with production files', function () {

    var originalCwd = process.cwd();

    beforeEach(function () {
        process.chdir(originalCwd);
    });

    describe ('tests on project1', function () {

        before(startServer('project1', ['-e', 'prod']));

        after(stopServer);

        var hash = null;

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    hash = body.match(/bundle\.([a-f0-9]{20})\.js/)[1];
                    return body;
                })
                .then(assertIndexHtmlBody);
        });

        it ('should serve bundle.js', function () {
            return assertResource('/bundle.' + hash + '.js')
                .then(assertBundleJsBodyMinified);
        });

        it ('should serve style.css', function () {
            return assertResource('/style.' + hash + '.css')
                .then(assertStyleCssBodyMinified);
        });

        it ('should not serve bundle.js.map', function () {
            return assertResource('/bundle.' + hash + '.js.map', 404);
        });

        it ('should not serve style.css.map', function () {
            return assertResource('/style.' + hash + '.css.map', 404);
        });
    });
});

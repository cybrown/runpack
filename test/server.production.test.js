var assertResource = require('./helpers').assertResource;
var assertIndexHtmlBodyMinified = require('./helpers').assertIndexHtmlBodyMinified;
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

        var jsHash = null;
        var cssHash = null;

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    jsHash = body.match(/bundle\.([a-f0-9\-]{20})\.js/)[1];
                    cssHash = body.match(/bundle\.([a-f0-9]{32})\.css/)[1];
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
});

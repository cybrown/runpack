var assertResource = require('./helpers').assertResource;
var assertHtmlResource = require('./helpers').assertHtmlResource;
var assertIndexHtmlBody = require('./helpers').assertIndexHtmlBody;
var assertBundleJsBody = require('./helpers').assertBundleJsBody;
var startServer = require('./helpers').startServer;
var stopServer = require('./helpers').stopServer;
var expect = require('chai').expect;
var http = require('http');
var path = require('path');

describe ('server with dev files', function () {

    var originalCwd = process.cwd();

    beforeEach(function () {
        process.chdir(originalCwd);
    });

    describe ('tests on project1 with proxy', function () {

        before(startServer('project1', ['--proxy', 'http://localhost:8080']));

        after(stopServer);

        it ('should proxy to a backend api', function (done) {
            var backendResponseBody = 'response from backend';
            var server = http.createServer(function (req, res) {
                res.end(backendResponseBody);
            }).listen(8080, function (err) {
                if (err) return done(err);
                assertResource('/backend/route').then(function (body) {
                    expect(body).to.equal(backendResponseBody);
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
            server.on('error', function (err) {
                done(err);
                server.close();
            });
        });
    });

    describe ('tests on project1 with proxy and backend api root', function () {

        before(startServer('project1', ['--proxy', 'http://localhost:8080', '--proxy-root', '/backend']));

        after(stopServer);

        it ('should proxy to a backend api with root', function (done) {
            var backendResponseBody = 'response from backend';
            var server = http.createServer(function (req, res) {
                res.end(backendResponseBody);
            }).listen(8080, function (err) {
                if (err) return done(err);
                assertResource('/backend/route').then(function (body) {
                    expect(body).to.equal(backendResponseBody);
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
            server.on('error', function (err) {
                done(err);
                server.close();
            });
        });

        it ('should serve index.html on a root outside the backend api root', function (done) {
            var backendResponseBody = 'response from backend';
            var server = http.createServer(function (req, res) {
                res.end(backendResponseBody);
            }).listen(8080, function (err) {
                if (err) return done(err);
                assertHtmlResource('/another/route', 200).then(function (body) {
                    expect(body).match(/^<!DOCTYPE html>/);
                    server.close();
                    done();
                }).catch(function (err) {
                    server.close();
                    done(err);
                });
            });
            server.on('error', function (err) {
                done(err);
                server.close();
            });
        });
    });

    describe ('tests on project1', function () {

        before(startServer('project1'));

        after(stopServer);

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    body.match(/bundle\.js/)[1];
                    return body;
                })
                .then(assertIndexHtmlBody);
        });

        it ('should serve index.html from another route', function () {
            return assertHtmlResource('/other/route')
                .then(function (body) {
                    body.match(/bundle\.js/)[1];
                    return body;
                })
                .then(assertIndexHtmlBody);
        });

        it ('should serve bundle.js', function () {
            return assertResource('/bundle.js')
                .then(assertBundleJsBody);
        });

        it ('should serve bundle.js.map', function () {
            return assertResource('/bundle.js.map');
        });
    });

    describe ('tests on project2', function () {

        before(startServer('project2'));

        after(stopServer);

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    expect(body).match(/^<!DOCTYPE html>/);
                    body.match(/bundle\.js/)[1];
                });
        });

        it ('should serve bundle.js', function () {
            return assertResource('/bundle.js')
                .then(body => {
                    expect(body).match(/console\.log\('index'\)/);
                });
        });
    });

    describe ('tests on project-with-package.json', function () {

        before(startServer('project-with-package.json'));

        after(stopServer);

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    expect(body).match(/^<!DOCTYPE html>/);
                    expect(body).match(/<title>App with package\.json<\/title>/);
                    body.match(/bundle\.js/)[1];
                });
        });

        it ('should serve bundle.js', function () {
            return assertResource('/bundle.js')
                .then(body => {
                    expect(body).match(/console\.log\('index'\)/);
                });
        });
    });

    describe ('Interpolation', function () {

        before(startServer('interpolation'));

        after(stopServer);

        it ('should serve index.html', function () {
            return assertResource('/')
                .then(function (body) {
                    expect(body).match(/^<!DOCTYPE html>/);
                    body.match(/bundle\.js/)[1];
                });
        });

        it ('should include another html template', function () {
            return assertResource('/bundle.js')
                .then(body => {
                    expect(body).match(/"<div>" \+ __webpack_require__\("\.\/b\.html"\) \+ "<\/div>"/);
                });
        });
    });

    describe ('Favicon', function () {

        before(startServer('favicon', ['--favicon', path.resolve(process.cwd(), 'test-samples', 'favicon', 'images', 'favicon.png')]));

        after(stopServer);

        it ('should include a favicon', function () {
            return assertResource('/')
                .then(body => {
                    expect(body).to.match(/<link rel="shortcut icon" href="favicon\.png"><\/head>/);
                });
        });
    });

    describe ('Favicon default', function () {

        before(startServer('favicon-default'));

        after(stopServer);

        it ('should include a favicon', function () {
            return assertResource('/')
                .then(body => {
                    expect(body).to.match(/<link rel="shortcut icon" href="favicon\.png"><\/head>/);
                });
        });
    });

    describe ('Escape CSS', function () {

        before(startServer('escape-css'));

        after(stopServer);

        it ('should escape css caracters', function () {
            return assertResource('/style.css')
                .then(body => expect(body).to.match(/\'\\A\'/));
        });
    });
});

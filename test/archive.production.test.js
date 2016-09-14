var assertFile = require('./helpers').assertFile;
var assertIndexHtmlBody = require('./helpers').assertIndexHtmlBody;
var assertBundleJsBodyMinified = require('./helpers').assertBundleJsBodyMinified;
var assertStyleCssBodyMinified = require('./helpers').assertStyleCssBodyMinified;
var runPackage = require('./helpers').runPackage;
var path = require('path');
var del = require('del');
var unzip = require('unzip');
var fs = require('fs');
var MemoryStream = require('memory-stream');

describe ('package zip with production files', function () {

    var originalCwd = process.cwd();

    beforeEach(function () {
        process.chdir(originalCwd);
    });

    describe ('tests on project1', function () {

        before (runPackage('project1', ['-e', 'prod']));

        var indexHtmlContent;
        var bundleJsContent;
        var styleCssContent;

        before (function (done) {
            setTimeout(function () {
                fs.createReadStream(path.resolve(process.cwd(), 'package.zip'))
                    .pipe(unzip.Parse())
                    .on('error', done)
                    .on('entry', function (entry) {
                        var ws = new MemoryStream();
                        entry.pipe(ws);
                        ws.on('finish', function () {
                            var stringContent = ws.get().toString();
                            if (/\.html$/.test(entry.path)) {
                                indexHtmlContent = stringContent;
                            } else if (/\.js$/.test(entry.path)) {
                                bundleJsContent = stringContent;
                            } else if (/\.css$/.test(entry.path)) {
                                styleCssContent = stringContent;
                            }
                        });
                    })
                    .on('close', function () {
                        done();
                    });
            }, 3000);
        });

        after (function () {
            return del(path.resolve(process.cwd(), 'test-samples', 'project1', 'package.zip'));
        });

        var hash = null;

        it ('should write package.zip', function () {
            return assertFile(path.resolve(process.cwd(), 'test-samples', 'project1', 'package.zip'));
        });

        it ('should archive index.html', function () {
            assertIndexHtmlBody(indexHtmlContent);
        });

        it ('should archive bundle.js', function () {
            assertBundleJsBodyMinified(bundleJsContent);
        });

        it ('should archive style.css', function () {
            assertStyleCssBodyMinified(styleCssContent);
        });
    });
});

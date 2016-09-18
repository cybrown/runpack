var expect = require('chai').expect;
var request = require('request');
var spawn = require('child_process').spawn;
var Promise = require('es6-promise-polyfill').Promise;
var path = require('path');
var fs = require('fs');

function assertResource(path, statusCode) {
    return new Promise(function (resolve, reject) {
        request('http://localhost:3000' + path, function (err, response, body) {
            expect(err).to.be.null;
            expect(response.statusCode).to.equal(statusCode || 200);
            resolve(body);
        });
    });
}

function assertIndexHtmlBody(body) {
    expect(body).match(/^<!DOCTYPE html>/);
    expect(body).match(/<link href="style\.[a-f0-9]{20}\.css" rel="stylesheet">/);
    expect(body).match(/<script type="text\/javascript" src="bundle\.[a-f0-9]{20}\.js"><\/script>/);
}

function assertBundleJsBody(body) {
    expect(body).match(/console\.log\(Math\.pow\(3, 4\)\)/);
    expect(body).match(/\/\/# sourceMappingURL=bundle\.[a-f0-9]{20}\.js\.map/);
}

function assertStyleCssBody(body) {
    expect(body).match(/body h1 {/);
    expect(body).match(/background-color: red;/);
    expect(body).match(/\/\*# sourceMappingURL=style\.[a-f0-9]{20}\.css\.map\*\//);
}

function assertBundleJsBodyMinified(body) {
    expect(body).match(/console\.log\(Math\.pow\(3,4\)\)/);
}

function assertStyleCssBodyMinified(body) {
    expect(body).match(/body h1{/);
    expect(body).match(/background-color:red/);
}

function runCli(binPath, args) {
    return new Promise(function (resolve, reject) {
        var hadError = false;
        var childWebpackServerProcess = spawn('node', [binPath].concat(args));
        childWebpackServerProcess.stdout.on('data', function (data) {
            if (/webpack: bundle is now VALID\./.test(data.toString('utf-8'))) {
                resolve();
            }
        });
        childWebpackServerProcess.on('error', function (err) {
            hadError = true;
            reject(err);
        });
        childWebpackServerProcess.stderr.on('data', function (data) {
            console.error(data.toString('utf8'))
        });
        childWebpackServerProcess.stderr.on('close', function (data) {
            if (!hadError) {
                resolve();
            }
        });
    });
}

var childWebpackServerProcess = null;

function startServer(projectName, args) {
    args = args || [];
    var packageJson = require(path.resolve(process.cwd(), 'package.json'));
    var originalCwd = process.cwd();
    var binPath = path.resolve(originalCwd, packageJson.bin);
    return function () {
        return new Promise(function (resolve, reject) {
            if (childWebpackServerProcess) {
                throw new Error('Webpack process is already running');
            }
            process.chdir(path.join('test-samples', projectName));
            childWebpackServerProcess = spawn('node', [binPath, 'server'].concat(args));
            childWebpackServerProcess.stdout.on('data', function (data) {
                if (/webpack: bundle is now VALID\./.test(data.toString('utf-8'))) {
                    resolve();
                }
            });
            childWebpackServerProcess.stderr.on('data', function (data) {
                console.error(data.toString('utf8'))
            });
            childWebpackServerProcess.stderr.on('close', function (data) {
                reject(new Error('Process unexpectedly terminated'));
            });
        });
    }
}

function stopServer() {
    return new Promise(function (resolve, reject) {
        if (childWebpackServerProcess) {
            childWebpackServerProcess.kill();
            childWebpackServerProcess.on('close', resolve);
            childWebpackServerProcess.on('error', reject);
            childWebpackServerProcess = null;
        } else {
            reject(new Error('Process not started'));
        }
    });
}

function runBuild(projectName, args) {
    args = args || [];
    var packageJson = require(path.resolve(process.cwd(), 'package.json'));
    var originalCwd = process.cwd();
    var binPath = path.resolve(originalCwd, packageJson.bin);
    return function () {
        return new Promise(function (resolve, reject) {
            process.chdir('test-samples/' + projectName);
            var childProcess = spawn('node', [binPath, 'build'].concat(args));
            childProcess.on('exit', function () {
                resolve();
            });
            childProcess.on('error', function (err) {
                reject(err);
            });
        });
    };
}

function runPackage(projectName, args) {
    args = args || [];
    var packageJson = require(path.resolve(process.cwd(), 'package.json'));
    var originalCwd = process.cwd();
    var binPath = path.resolve(originalCwd, packageJson.bin);
    return function () {
        return new Promise(function (resolve, reject) {
            process.chdir('test-samples/' + projectName);
            var childProcess = spawn('node', [binPath, 'package'].concat(args));
            childProcess.on('exit', function () {
                resolve();
            });
            childProcess.on('error', function (err) {
                reject(err);
            });
        });
    };
}

function assertFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (err, data) {
            if (err) return reject(err);
            resolve(data.toString('utf-8'));
        });
    });
}

function assertFileNonExistant(filePath) {
    return new Promise(function (resolve, reject) {
        fs.exists(filePath, function (result) {
            expect(result).to.equal(false);
            resolve();
        });
    });
}

module.exports = {
    assertResource: assertResource,
    assertIndexHtmlBody: assertIndexHtmlBody,
    assertBundleJsBody: assertBundleJsBody,
    assertStyleCssBody: assertStyleCssBody,
    startServer: startServer,
    stopServer: stopServer,
    runBuild: runBuild,
    assertFile: assertFile,
    assertFileNonExistant: assertFileNonExistant,
    runPackage: runPackage,
    assertBundleJsBodyMinified: assertBundleJsBodyMinified,
    assertStyleCssBodyMinified: assertStyleCssBodyMinified,
    runCli: runCli
};

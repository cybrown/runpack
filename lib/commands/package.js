module.exports = function commandPackage(params, logger) {
    var fs = require('fs');
    var path = require('path');
    var webpack = require('webpack');
    var mergeWebpackConfig = require('webpack-config-merger');
    var archiver = require('archiver');
    var memoryFsUtil = require('../util/memory-fs-util');
    var getWebpackConfiguration = require('../util/get-webpack-configuration');
    var MemoryFileSystem = require('memory-fs');
    var findCurrentPackageInfo = require('../../config/lib/find-current-package-info');

    var currentPackageInfo = findCurrentPackageInfo();

    function createArchiveFromMemoryFs(type, memoryFs) {
        var archiverOptions = {};
        var archiveType = 'zip';
        var archiveExtension = 'zip';
        var archiveFileName = 'package';
        if (currentPackageInfo) {
            archiveFileName = currentPackageInfo.name + '-' + currentPackageInfo.version;
        }
        if (type === 'tgz') {
            archiveType = 'tar';
            archiveExtension = 'tar.gz';
            archiverOptions.gzip = true;
            archiverOptions.gzipOptions = { level: 1 };
        } else {
            archiveType = 'zip';
        }
        var destinationArchiveFile = path.resolve(process.cwd(), (archiveFileName + '.' + archiveExtension));
        logger.verbose('Archive type:', archiveType);
        logger.verbose('Archive destination path:', destinationArchiveFile);
        var archive = archiver.create(archiveType, archiverOptions);
        memoryFsUtil
            .listFilesRecursive(memoryFs, process.cwd())
            .filter(function (absolutePath) {
                return memoryFs.statSync(absolutePath).isFile();
            })
            .forEach(function (absolutePath) {
                archive.append(memoryFs.readFileSync(absolutePath), {
                    name: path.join(path.relative(path.dirname(absolutePath), process.cwd()), path.basename(absolutePath)),
                    stat: memoryFs.statSync(absolutePath)
                });
            });
        var output = fs.createWriteStream(destinationArchiveFile);
        archive.pipe(output);
        archive.on('end', function () {
            logger.verbose('Archive created');
        });
        archive.on('error', function (err) {
            logger.error('Error creating archive');
            logger.error(err);
        });
        archive.finalize();
        logger.verbose('Archive finalized');
    }

    var env = params.env;
    if (params.favicon) {
        process.env.RUNPACK_FAVICON = params.favicon;
    }
    if (params.input) {
        process.env.RUNPACK_INPUT = params.input;
    }
    var webpackConfig = mergeWebpackConfig(getWebpackConfiguration(env), {
        output: {
            path: process.cwd()
        }
    });
    var memoryFs = new MemoryFileSystem();
    var compiler = webpack(webpackConfig);
    compiler.outputFileSystem = memoryFs;
    compiler.run(function (err, stats) {
        if (err) throw err;
        createArchiveFromMemoryFs(params.type, memoryFs);
    });
};

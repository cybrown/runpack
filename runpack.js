var packageInfo = require('./package.json');
var commander = require('commander');
var winston = require('winston');

var commandCalled = false;

var logger = new (winston.Logger)({
    transports: [
      new winston.transports.Console()
    ]
});

logger.cli();

function commandWrapper(commandName) {
    return function (params) {
        var command = require('./lib/commands/' + commandName);
        commandCalled = true;
        if (commander.verbose) {
            logger.transports.console.level = 'verbose';
        }
        logger.verbose('Verbose mode enabled');
        if (params.env) {
            logger.verbose('Environment:', params.env);
        }
        logger.verbose('Running command:', commandName);
        return command.apply(this, [params].concat(logger));
    };
}

commander
    .version(packageInfo.version)
    .option('-v, --verbose', 'Enable verbose mode');

commander
    .command('server')
    .alias('s')
    .description('Run development server')
    .option('-p, --port <port>', 'Port for development server')
    .option('-e --env <environment>', 'Specify environment, dev or prod', /^(dev|prod)$/i, 'dev')
    .action(commandWrapper('server'));

commander
    .command('build')
    .alias('b')
    .description('Create production files')
    .option('-e --env <environment>', 'Specify environment, dev or prod', /^(dev|prod)$/i, 'prod')
    .action(commandWrapper('build'));

commander
    .command('package')
    .alias('p')
    .description('Create production package')
    .option('-t --type [type]', 'Create an archive (zip or tgz), defaults to zip', /^(zip|tgz)$/i, 'zip')
    .option('-e --env <environment>', 'Specify environment, dev or prod', /^(dev|prod)$/i, 'prod')
    .action(commandWrapper('package'));

commander
    .command('test')
    .alias('t')
    .description('Run unit tests')
    .option('-c --coverage', 'Enable coverage')
    .option('-r --test-report', 'Output a test result report')
    .action(commandWrapper('test'));

commander
    .command('clean')
    .description('Remove build files')
    .action(commandWrapper('clean'));

commander
    .command('eject')
    .description('Write configuration files in your project')
    .option('--skip-npm-install', 'Do not install npm dependencies')
    .action(commandWrapper('eject'));

commander.parse(process.argv);

if (!process.argv.slice(2).length || !commandCalled) {
    commander.outputHelp();
}

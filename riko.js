import program from 'commander';
import { baseDir, packageJson } from './utils/variables';
import { genericLog, logOptionsError } from './utils/functions';
const commandsDir = `${baseDir}/cmds`;

//VERSION, USAGE, ETC
program
    .alias('riko')
    .usage('<cmd> [subcmds...]')
    .option('-v, --version', 'output the version number', () => {
        genericLog(packageJson.version);
    });

//INITIALIZE
program
    .command('init')
    .alias('i')
    .description('Initializes a new project via interactive command prompts.')
    .action(() => {
        import(`${commandsDir}/init`)
            .then((m) => m.default)
            .then((module) => module({ _: 'init' }))
            .catch((err) => {
                genericLog('err > cmds > init > ' + err, 'red');
                console.error(err.stack);
            });
    }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ init');
    console.log('    $ i');
    console.log();
});

//SETUP
program
    .command('setup <project-type> <project-name>')
    .alias('s')
    .description('Initializes a new project with default options.')
    .action((projectType, projectName) => {
        import(`${commandsDir}/setup`)
            .then((m) => m.default)
            .then((module) => module({
                _: 'setup',
                projectType,
                projectName
            }))
            .catch((err) => {
                genericLog('err > cmds > setup > ' + err, 'red');
                console.error(err.stack);
            });
    }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ setup react AwesomeNewWebProject');
    console.log('    $ setup electron Awesome New Electron Project');
    console.log();
});

//CREATE
program
    .command('create <file-type> <file-name..>')
    .alias('c')
    .description('Creates a new boilerplate file.')
    .action((fileType, fileName) => {
        import(`${commandsDir}/create`)
            .then((m) => m.default)
            .then((module) => module({
                _: 'create',
                fileType,
                fileName
            }))
            .catch((err) => {
                genericLog('err > cmds > create > ' + err, 'red');
                console.error(err.stack);
            });
    }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ create component Footer.js');
    console.log('    $ create dummy-component Header.jsx');
    console.log();
});

//RUN
program
    .command('run <run-command>')
    .alias('r')
    .description('Runs actions on project.')
    .action((runCommand) => {
        import(`${commandsDir}/run`)
            .then((m) => m.default)
            .then((module) => module({
                _: 'run',
                runCommand
            }))
            .catch((err) => {
                genericLog('err > cmds > run > ' + err, 'red');
                console.error(err.stack);
            });
    }).on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ run electron-dev');
    console.log('    $ run react-server');
    console.log();
});

//INVALID COMMANDS CATCH ALL
program
    .command('*', 'invalid commands catch all', {noHelp: true})
    .action((runCommand) => {
        logOptionsError([], runCommand);
    });

//DISPLAY HELP BY DEFAULT IF NO ARGS ARE PROVIDED
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);

export default program;
#!/usr/bin/env node
const program = require('commander');
const { baseDir, packageJson } = require('./utils/variables')();
const funcs = require('./utils/functions')();
const commandsDir = `${baseDir}/cmds`;

const cmds = funcs.readFilesInDirectorySync(commandsDir)
    .reduce((result, file) => {
        const filename = file.split('.')[0];
        result[filename] = require(`${commandsDir}/${filename}`);
        return result;
    }, {});

//VERSION, USAGE, ETC
program
    .alias('riko')
    .usage('<cmd> [subcmds...]')
    .option('-v, --version', 'output the version number', () => {
        funcs.genericLog(packageJson.version);
    });

//INITIALIZE
program
    .command('init')
    .alias('i')
    .description('Initializes a new project via interactive command prompts.')
    .action(() => {
        cmds.init({
            _: 'init'
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
        cmds.setup({
            _: 'setup',
            projectType,
            projectName
        });
    }).on('--help', () => {
        console.log('  Examples:');
        console.log();
        console.log('    $ setup web AwesomeNewWebProject');
        console.log('    $ setup electron Awesome New Electron Project');
        console.log();
    });

//CREATE
program
    .command('create <file-type> <file-name..>')
    .alias('c')
    .description('Creates a new boilerplate file.')
    .action((fileType, fileName) => {
        cmds.create({
            _: 'create',
            fileType,
            fileName
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
        cmds.run({
            _: 'run',
            runCommand
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
        funcs.logOptionsError([], runCommand);
    });

//DISPLAY HELP BY DEFAULT IF NO ARGS ARE PROVIDED
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);

module.exports = program;
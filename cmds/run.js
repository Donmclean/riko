const _v = require('../config/variables')();
const funcs = require('../config/functions')();
const actions = require('../actions/_index');

const options = ['web-dev', 'web-prod', 'web-server', 'web-prod-server', 'electron-dev', 'electron-prod', 'electron-server'];

const command = _v.argv.command(
    {
        command: 'run <run-command>',
        aliases: ['run', 'r'],
        desc: 'Runs actions on project.',
        handler: (argv) => {
            const validChoice = funcs.isValidOption(options, argv.runCommand);

            if(validChoice) {
                const runCommand = funcs.sanitizeProjectName(argv.runCommand);
                actions.run.executeRun(runCommand);
            } else {
                funcs.throwOptionsError(options);
            }
        }
    })
    .recommendCommands()
    .demandCommand(1)
    .help()
    .argv;

module.exports = command;
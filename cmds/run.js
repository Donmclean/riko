const _v = require('../config/variables')();
const funcs = require('../config/functions')();
const actions = require('../actions/_index');

const options = [
    //WEB COMMANDS
    'web-dev', 'web-prod', 'web-server', 'web-prod-server',
    //ELECTRON COMMANDS
    'electron-dev', 'electron-prod', 'electron-server',
    //NODE-SERVER COMMANDS
    'node-server-dev', 'node-server-prod'
];

const command = _v.argv.command(
    {
        command: 'run <run-command>',
        aliases: ['r'],
        desc: 'Runs actions on project.',
        handler: (argv) => {
            const validChoice = funcs.isValidOption(options, argv.runCommand);

            if(validChoice) {
                const runCommand = funcs.sanitizeProjectName(argv.runCommand);
                actions.run(runCommand);
            } else {
                funcs.throwOptionsError(options, argv.runCommand);
            }
        }
    })
    .recommendCommands()
    .argv;

module.exports = command;

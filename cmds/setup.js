const _v = require('../config/variables')();
const funcs = require('../config/functions')();
const actions = require('../actions/_index');

const options = ['js', 'web', 'electron', 'mobile'];

const command = _v.argv.command(
    {
        command: 'setup <project-type> <project-name..>',
        aliases: ['s'],
        desc: 'Initializes a new project.',
        handler: (argv) => {
            const validChoice = funcs.isValidOption(options, argv.projectType);

            if(validChoice) {
                const projectName = funcs.sanitizeProjectName(argv.projectName);
                actions.setup.executeSetup(argv._, argv.projectType, projectName);
            } else {
                funcs.throwOptionsError(options, argv.projectType);
            }
        }
    })
    .recommendCommands()
    .argv;

module.exports = command;
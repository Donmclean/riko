const _v = require('../config/variables')();
const funcs = require('../config/functions')();
const actions = require('../actions/_index');

const options = ['js', 'web', 'electron', 'mobile'];

const command = _v.argv.command(
    {
        command: 'setup <project-type> <project-name..>',
        aliases: ['setup', 's'],
        desc: 'Creates/Initializes a new project.',
        handler: (argv) => {
            const validChoice = funcs.isValidOption(options, argv.projectType);

            if(validChoice) {
                const projectName = funcs.sanitizeProjectName(argv.projectName);
                actions.setup.executeSetup(argv._, argv.projectType, projectName);
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
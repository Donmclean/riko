const _v = require('../config/variables');
const funcs = require('../config/functions')();

const options = ['js', 'web', 'electron', 'mobile'];

_v.argv
    .command({
        command: 'setup <project-type> <project-name..>',
        aliases: ['setup', 's'],
        desc: 'Creates/Initializes a new project.',
        handler: (argv) => {
            const validChoice = funcs.isValidOption(options, argv.projectType);
            if(validChoice) {
                const projectName = funcs.sanitizeProjectName(argv.projectName)
                funcs.executeSetup(argv.projectType, projectName);
            } else {
                funcs.throwOptionsError(options);
            }
        }
    })
    .recommendCommands()
    .demandCommand(1)
    .help()
    .argv;
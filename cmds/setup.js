const _v = require('../config/variables')();
const funcs = require('../config/functions')();
const actions = require('../actions/_index');

const command = _v.argv.command(
    {
        command: 'setup <project-type> <project-name..>',
        aliases: ['s'],
        desc: 'Initializes a new project.',
        handler: (argv) => {
            const { baseDir } = _v;
            const defaultSetupOptionsPath = `${baseDir}/bin/_setup`;
            const options = funcs.readFilesInDirectorySync(defaultSetupOptionsPath);

            const validChoice = funcs.isValidOption(options, argv.projectType);

            if(validChoice) {
                const projectName = funcs.sanitizeProjectName(argv.projectName);
                actions.setup(argv._, argv.projectType, projectName);
            } else {
                funcs.throwOptionsError(options, argv.projectType);
            }
        }
    })
    .recommendCommands()
    .argv;

module.exports = command;
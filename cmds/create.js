const _v = require('../config/variables')();
const funcs = require('../config/functions')();
const actions = require('../actions/_index');

const command = _v.argv.command(
    {
        command: 'create <file-type> <file-name..>',
        // aliases: ['c'],
        desc: 'creates a new boilerplate file.',
        handler: (argv) => {
            const { fs, baseDir, cwd, _ } = _v;

            const defaultBoilerplatePath = `${baseDir}/bin/_create`;
            const defaultOptions = fs.readdirSync(defaultBoilerplatePath);

            const customConfig = funcs.getFileIfExists(`${_v.cwd}/src/rikoconfig`);
            let customOptions;

            try {
                customOptions = fs.readdirSync(customConfig.customBoilerplatePath);
            } catch (err) {
                customOptions = undefined;
            }

            const totalOptions = !_.isNil(customOptions) ? defaultOptions.concat(customOptions) : defaultOptions;

            const validChoice = funcs.isValidOption(totalOptions, argv.fileType);

            if(validChoice) {
                const fileName = funcs.sanitizeProjectName(argv.fileName);
                const finalBoilerplatePath = _.includes(customOptions, argv.fileType) ? customConfig.customBoilerplatePath : defaultBoilerplatePath;
                actions.create(finalBoilerplatePath, argv._, argv.fileType, fileName);
            } else {
                return funcs.throwOptionsError(totalOptions, argv.fileType);
            }
        }
    })
    .recommendCommands()
    .argv;

module.exports = command;
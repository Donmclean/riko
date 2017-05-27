const _v = require('../utils/variables')();
const funcs = require('../utils/functions')();
const actions = require('../actions/_index');

module.exports = (argv) => {
    const { baseDir } = _v;
    const defaultSetupOptionsPath = `${baseDir}/bin/_setup`;
    const options = funcs.readFilesInDirectorySync(defaultSetupOptionsPath);

    const validChoice = funcs.isValidOption(options, argv.projectType);

    if(validChoice) {
        const projectName = funcs.sanitizeString(funcs.hasWhiteSpace(argv.projectName) ? _v._.camelCase(argv.projectName) : argv.projectName);

        actions.setup(argv._, argv.projectType, projectName);
    } else {
        funcs.logOptionsError(options, argv.projectType);
    }
};
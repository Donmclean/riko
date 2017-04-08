const _v = require('../utils/variables')();
const funcs = require('../utils/functions')();
const actions = require('../actions/_index');

module.exports = (argv) => {
    const { baseDir, cwd, _ } = _v;

    const defaultBoilerplatePath = `${baseDir}/bin/_create`;
    const defaultOptions = funcs.readFilesInDirectorySync(defaultBoilerplatePath);

    const customConfig = funcs.getFileIfExists(`${_v.cwd}/src/rikoconfig`);
    let customOptions;

    try {
        customOptions = funcs.readFilesInDirectorySync(customConfig.customBoilerplatePath);
    } catch (err) {
        customOptions = undefined;
    }

    const totalOptions = !_.isNil(customOptions) ? defaultOptions.concat(customOptions) : defaultOptions;

    const validChoice = funcs.isValidOption(totalOptions, argv.fileType);

    if(validChoice) {
        const fileName = funcs.sanitizeString(argv.fileName);
        const finalBoilerplatePath = _.includes(customOptions, argv.fileType) ? customConfig.customBoilerplatePath : defaultBoilerplatePath;
        actions.create(finalBoilerplatePath, argv._, argv.fileType, fileName);
    } else {
        return funcs.logOptionsError(totalOptions, argv.fileType);
    }
};
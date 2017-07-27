import { baseDir } from '../utils/variables';
import { isNil, includes } from 'lodash';
import { readFilesInDirectorySync, isValidOption, sanitizeString, logOptionsError } from '../utils/functions';
import create from '../actions/create';

export default (argv) => {
    const defaultBoilerplatePath = `${baseDir}/bin/_create`;
    const defaultOptions = readFilesInDirectorySync(defaultBoilerplatePath);

    const customConfig = require('../utils/coreRikoConfig'); //TODO: use dynamic import
    let customOptions;

    try {
        customOptions = readFilesInDirectorySync(customConfig.customBoilerplatePath);
    } catch (err) {
        customOptions = undefined;
    }

    const totalOptions = !isNil(customOptions) ? defaultOptions.concat(customOptions) : defaultOptions;

    const validChoice = isValidOption(totalOptions, argv.fileType);

    if(validChoice) {
        const fileName = sanitizeString(argv.fileName);
        const finalBoilerplatePath = includes(customOptions, argv.fileType) ? customConfig.customBoilerplatePath : defaultBoilerplatePath;
        create(finalBoilerplatePath, argv._, argv.fileType, fileName);
    } else {
        return logOptionsError(totalOptions, argv.fileType);
    }
};
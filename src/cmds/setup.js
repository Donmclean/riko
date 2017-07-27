import setup from '../actions/setup';
import { camelCase } from 'lodash';
import { baseDir } from '../utils/variables';
import { hasWhiteSpace, sanitizeString, readFilesInDirectorySync, isValidOption, logOptionsError } from '../utils/functions';

export default (argv) => {
    const defaultSetupOptionsPath = `${baseDir}/bin/_setup`;
    const options = readFilesInDirectorySync(defaultSetupOptionsPath);

    const validChoice = isValidOption(options, argv.projectType);

    if(validChoice) {
        const projectName = sanitizeString(hasWhiteSpace(argv.projectName) ? camelCase(argv.projectName) : argv.projectName);

        setup(argv._, argv.projectType, projectName);
    } else {
        logOptionsError(options, argv.projectType);
    }
};
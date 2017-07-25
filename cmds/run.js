import { chain } from 'lodash';
import { sanitizeString, isValidOption, logOptionsError } from '../utils/functions';
import run from '../actions/run';
import { runCommands } from '../constants/index';

export default (argv) => {
    const options = chain(runCommands).values().flatten().value();

    const validChoice = isValidOption(options, argv.runCommand);

    if(validChoice) {
        const runCommand = sanitizeString(argv.runCommand);
        run(runCommand);
    } else {
        logOptionsError(options, argv.runCommand);
    }
};

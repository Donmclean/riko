const _ = require('lodash');
const funcs = require('../utils/functions')();
const actions = require('../actions/_index');
const { runCommands } = require('../constants/index');

module.exports = (argv) => {
    const options = _.chain(runCommands).values().flatten().value();

    const validChoice = funcs.isValidOption(options, argv.runCommand);

    if(validChoice) {
        const runCommand = funcs.sanitizeString(argv.runCommand);
        actions.run(runCommand);
    } else {
        funcs.logOptionsError(options, argv.runCommand);
    }
};

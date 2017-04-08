const funcs = require('../utils/functions')();
const actions = require('../actions/_index');

module.exports = (argv) => {
    const options = [
        //WEB COMMANDS
        'web-dev', 'web-prod', 'web-server', 'web-prod-server',
        //ELECTRON COMMANDS
        'electron-dev', 'electron-prod', 'electron-server',
        //NODE-SERVER COMMANDS
        'node-server-dev', 'node-server-prod'
    ];

    const validChoice = funcs.isValidOption(options, argv.runCommand);

    if(validChoice) {
        const runCommand = funcs.sanitizeString(argv.runCommand);
        actions.run(runCommand);
    } else {
        funcs.logOptionsError(options, argv.runCommand);
    }
};

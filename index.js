#!/usr/bin/env node
const argv = require('yargs');

const command = argv
    .version()
    .commandDir('cmds')
    .demandCommand(1, 'You need at least one command before moving on')
    .recommendCommands()
    .help()
    .argv;

module.exports = command;
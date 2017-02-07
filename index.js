#!/usr/bin/env node
const _v = require('./config/variables');

const command = _v.argv
    .version()
    .commandDir('cmds')
    .demandCommand(1, 'You need at least one command before moving on')
    .recommendCommands()
    .help()
    .argv;

module.exports = command;
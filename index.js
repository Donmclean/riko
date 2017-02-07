#!/usr/bin/env node
const _v = require('./config/variables');

_v.argv
    .commandDir('cmds')
    .demandCommand(1, 'You need at least one command before moving on')
    .recommendCommands()
    .help()
    .argv;
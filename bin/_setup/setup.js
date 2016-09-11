"use strict";
const
    qfs     = require('q-io/fs'),
    _       = require('lodash'),
    chalk   = require('chalk'),
    baseDir = process.cwd(),
    srcDir  = baseDir+'/src',
    args    = process.argv;

let srcToCopy = '';

switch (args[2]) {
    case '--demo': {
        srcToCopy = '_demo-src';
        break;
    }
    case '--setup': {
        srcToCopy = 'src';
        break;
    }
    default: {
        console.log(`${chalk.red('invalid arg terminating...')}`);
        process.exit(0);
    }
}

console.log(`checking for existing ${chalk.blue('src/')} folder...`);

qfs.list(baseDir)
    .then(files => {
        if(_.includes(files, 'src')) {
            console.log(`${chalk.blue('src/')} folder must not exist during setup. ${chalk.red('terminating...')}`);
            process.exit(0);
        }
        console.log(`creating ${chalk.blue('src/')} folder and sub directories`);
        return qfs.copyTree(baseDir+`/bin/_setup/${srcToCopy}`, srcDir);
    })
    .then(() => {
        console.log(`${chalk.blue('src/')} folder created ${chalk.green('successfully')}`);
    })
    .catch(err => {
        console.error(`${chalk.red('ERROR: setting up src/ folder', err)}`)
    });

const config = require('../src/custom-config') || {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

config.vars                     = require('./variables')();

config.baseDir                  = process.cwd();
config.srcDir                   = config.baseDir+"/src";

config.buildFiles               = [
    config.baseDir+'/webpack/**/*.js',
    config.baseDir+'/test-riko/**/*.js'
];


module.exports = config;
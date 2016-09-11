//**********************************************************************
//Ensure src/custom-config.js file exists
//**********************************************************************
try {
    require('../src/custom-config')
} catch (err) {
    if(err) {
        throw new Error('ERROR: no custom-config.js file found in src/ directory', err);
    }
}

const config = require('../src/custom-config') || {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

config.vars                     = require('./variables')();

config.baseDir                  = process.cwd();
config.srcDir                   = config.baseDir+"/src";

config.buildFiles               = [
    config.baseDir+'/webpack/**/*.js',
    config.baseDir+'/bin/_setup/setup.js',
    config.baseDir+'/test-riko/**/*.js'
];


module.exports = config;
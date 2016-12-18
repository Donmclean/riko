//**********************************************************************
//Ensure src/custom-config.js file exists
//**********************************************************************
try {
    require('../src/custom-config');
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

config.baseDir                  = config.vars.path.resolve(__dirname, '../');
config.srcDir                   = config.baseDir + "/src";

config.buildFiles               = [
    config.baseDir + '/webpack/**/*.js',
    config.baseDir + '/test-riko/**/*.js',
    config.baseDir + '/server.js',
    config.baseDir + '/gulpfile.js'
];


module.exports = config;
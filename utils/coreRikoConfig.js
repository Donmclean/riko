//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************
const
    funcs   = require('../utils/functions')(),
    _       = require('lodash'),
    assert  = require('assert'),
    config  = {};

//Root Directory
config.baseDir      = process.cwd(); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir       = `${config.baseDir}/src`; //IMPORTANT! DO NOT OVERRIDE!

//Temporary Directory
config.tempDir      = `${config.baseDir}/temp`;

//Custom project Package.json
config.packageJson  = funcs.getFileIfExists(`${config.baseDir}/package.json`);

config.srcFiles     = [
    config.srcDir+'/**/*.js?(x)',
    '!'+config.srcDir+'/rikoconfig.js',
    '!'+config.srcDir+'/vendor/**/*.js',
    '!'+config.srcDir+'/__tests__utils/**/*.js'
];

//Relative Output Paths
config.jsOutputPath = 'assets/js';
config.cssOutputPath = 'assets/css';
config.audioOutputPath = 'assets/audio';
config.miscFileOutputPath = 'assets/files'; //pdf, docs, etc
config.fontOutputPath = 'assets/fonts';
config.imageOutputPath = 'assets/images';
config.videoOutputPath = 'assets/videos';

const customConfig  = funcs.getFileIfExists(`${config.srcDir}/rikoconfig`);
const defaultConfig = funcs.getDefaultConfigFromRunCommand(process.env.runCommand);

//**********************************************************************
//******************************ASSERTIONS******************************
//**********************************************************************

funcs.genericLog('validating rikoconfig.js file..');

const requiredFields = {
    entry: 'object',
    output: 'object'
};

//Validate Config Fields
_.forEach(defaultConfig, (value, key) => {
    //make sure default keys are present in rikoconfig
    assert.ok(key in customConfig, `config.${key} must be present in rikoconfig.js`);

    //handle require fields
    _.includes(requiredFields , key) ? assert.ok(!_.isEmpty(customConfig[key]), `config.${key} must not be empty rikoconfig.js`) : null;

    //make sure default keys are of valid type in rikoconfig
    assert.equal(typeof customConfig[key], typeof value, `config.${key}'s value must be of type '${typeof value}' in rikoconfig.js`);

    //resolve required paths
    switch(requiredFields[key]) {
        case 'string': {
            customConfig[key] = funcs.sanitizePath(config.baseDir, customConfig[key]);
            break;
        }
        case 'object': {
            customConfig[key] = funcs.resolveObjValues(value, config.baseDir);
            break;
        }
        default: {
            break;
        }
    }
});

funcs.genericLog('rikoconfig.js file is vaild!', 'green');

const newConfig = Object.assign(
    {},
    defaultConfig,
    customConfig,
    config
);

module.exports = newConfig;
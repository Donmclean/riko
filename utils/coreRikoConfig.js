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

const requiredFields = [
    'title',
    'cssOutputFilename' //.match(/\.(css)$/)
];

_.forEach(defaultConfig, (value, key) => {
    _.includes(requiredFields , key) ? assert.ok(!_.isEmpty(customConfig[key]), `config.${key} must not be empty rikoconfig.js`) : null;
    key === 'cssOutputFilename' ? assert.ok(!_.isEmpty(customConfig[key].match(/\.(css)$/)), `config.${key} must be a .css filename in rikoconfig.js`) : null;
    assert.ok(key in customConfig, `config.${key} must be present in rikoconfig.js`);
    assert.equal(typeof customConfig[key], typeof value, `config.${key}'s value must be of type '${typeof value}' in rikoconfig.js`);
});

//Required Absolute Paths
const requiredAbsolutePaths = [
    'destDir',
    'tempDir',
    'entryFile',
    'templateFile'
];

const resolvedPaths = requiredAbsolutePaths.reduce((accObj, key) => {
    assert.ok(!_.isEmpty(customConfig[key]), `config.${key} must not be empty in rikoconfig.js`);
    key === 'templateFile' ? assert.ok(customConfig[key].match(/\.(pug|ejs|hbs)$/), `config.${key}'s value must be a valid .pug, .ejs or .hbs file`) : null;
    accObj[key] = funcs.sanitizePath(config.baseDir, customConfig[key]);
    return accObj;
}, {});

funcs.genericLog('rikoconfig.js file is vaild!', 'green');

const newConfig = Object.assign(
    {},
    customConfig,
    resolvedPaths,
    config
);

module.exports = newConfig;
//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************
const
    funcs   = require('../utils/functions')(),
    _       = require('lodash'),
    config  = {};

//Root Directory
config.baseDir      = process.cwd(); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir       = `${config.baseDir}/src`; //IMPORTANT! DO NOT OVERRIDE!

//Custom project Package.json
config.packageJson  = funcs.getFileIfExists(`${config.baseDir}/package.json`);

config.srcFiles                 = [
    config.srcDir+'/**/*.js?(x)',
    '!'+config.srcDir+'/rikoconfig.js',
    '!'+config.srcDir+'/vendor/**/*.js',
    '!'+config.srcDir+'/__tests__utils/**/*.js'
];

const customConfig  = funcs.getFileIfExists(`${config.srcDir}/rikoconfig`);

//**********************************************************************
//******************************ASSERTIONS******************************
//**********************************************************************

//Required Absolute Paths
const requiredAbsolutePaths = [
    'destDir',
    'tempDir',

    'entryFile',

    'templateFile', //'src/templates/index.pug'.match(/\.pug$/)

    'customBoilerplatePath'
];

//Optional Absolute Paths
const optionalPaths = [
    'eslintConfig',
    'stylelintConfig',

    'entryFile',

    'customBoilerplatePath'
];

//Optional Relative Paths
const optionalRelativePaths = {
    jsOutputPath: 'assets/js',
    cssOutputPath: 'assets/css',
    audioOutputPath: 'assets/audio',
    miscFileOutputPath: 'assets/files', //pdf, docs, etc
    fontOutputPath: 'assets/fonts',
    imageOutputPath: 'assets/images',
    videoOutputPath: 'assets/videos'
};

const sanitizedOptionalRelativePaths = Object.keys(optionalRelativePaths).reduce((accObj, key) => {
    accObj[key] = _.isNil(customConfig[key]) ? optionalRelativePaths[key] : funcs.removeLeadingAndTrailingSlashesFromString(customConfig[key]);
    return accObj;
}, {});

const resolvedPaths = requiredAbsolutePaths.reduce((accObj, key) => {
    accObj[key] = funcs.sanitizePath(config.baseDir, customConfig[key]);
    return accObj;
}, {});

const newConfig = Object.assign(
    {},
    customConfig,
    resolvedPaths,
    sanitizedOptionalRelativePaths,
    config
);

module.exports = newConfig;
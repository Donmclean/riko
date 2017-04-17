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
const requiredPaths = [
    'destDir',
    'tempDir',
    'eslintConfig',
    'stylelintConfig',
    'nightwatchConfig',

    'faviconPath',
    'entryFile',

    'templateFile',

    'customBoilerplatePath'
];

//Optional Relative Paths
const optionalRelativePaths = {
    js_output_path: 'assets/js',
    css_output_path: 'assets/css',
    media_audio_output_path: 'assets/audio',
    media_files_output_path: 'assets/files', //pdf, docs, etc
    media_fonts_output_path: 'assets/fonts',
    media_images_output_path: 'assets/images',
    media_video_output_path: 'assets/videos'
};

const sanitizedOptionalRelativePaths = Object.keys(optionalRelativePaths).reduce((accObj, key) => {
    accObj[key] = _.isNil(customConfig[key]) ? optionalRelativePaths[key] : funcs.removeLeadingAndTrailingSlashesFromString(customConfig[key]);
    return accObj;
}, {});

const resolvedPaths = requiredPaths.reduce((accObj, key) => {
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
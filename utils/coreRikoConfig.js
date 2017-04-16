//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************
const
    funcs   = require('../utils/functions')(),
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

const requiredPaths = [
    'destDir',
    'tempDir',
    'eslintConfig',
    'stylelintConfig',
    'nightwatchConfig',

    'faviconPath',
    'EntryFile',

    // 'js_output_path',
    // 'media_audio_output_path',
    // 'media_files_output_path',
    // 'media_fonts_output_path',
    // 'media_images_output_path',
    // 'media_video_output_path',
    'template_src_path',

    'customBoilerplatePath'
];

const resolvedPaths = requiredPaths.reduce((accObj, key) => {
    accObj[key] = funcs.sanitizePath(config.baseDir, customConfig[key]);
    return accObj;
}, {});

const newConfig = Object.assign({}, customConfig, resolvedPaths, config);

module.exports = newConfig;
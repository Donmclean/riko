const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

const path                      = require('path');

//Root Directory
const baseDir                   = path.resolve(__dirname, '../'); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir                   = baseDir+"/src"; //IMPORTANT! DO NOT OVERRIDE!

//**********************************************************************
//******************************CUSTOM**********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'baseDir' unless specified otherwise.
// eg: baseDir+'/path'

config.moduleName               = 'riko';
config.destDir                  = baseDir+"/dist";
config.tempDir                  = baseDir+"/temp";

config.EXPRESS_PORT             = 3000;
config.EXPRESS_ROOT             = config.destDir;

config.packageJson              = baseDir+'/package.json';
config.nodemonJson              = `${baseDir}/nodemon.json`;

config.srcFiles                 = [
    config.srcDir+'/**/*.js?(x)',
    '!'+config.srcDir+'/rikoconfig.js',
    '!'+config.srcDir+'/vendor/**/*.js',
    '!'+config.srcDir+'/__tests__utils/**/*.js'
];

config.entryFile = config.srcDir+'/app.js';

//specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
//must be an absolute path.
config.customBoilerplatePath = `${config.srcDir}/riko-custom-boilerplates`;

module.exports = config;
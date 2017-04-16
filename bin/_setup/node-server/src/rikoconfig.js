//**********************************************************************
//******************************CUSTOM**********************************
//**********************************************************************
const config = {};

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
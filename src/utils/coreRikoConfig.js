import { getFileIfExists } from './functions';
const config  = {};

//Root Directory
config.baseDir      = process.cwd(); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir       = `${config.baseDir}/src`; //IMPORTANT! DO NOT OVERRIDE!

//Temporary Directory
config.tempDir      = `${config.baseDir}/temp`;

config.destDir      = `${config.baseDir}/dist`;

//Server Port
config.SERVER_PORT  = process.argv[4];

//Custom project Package.json
config.packageJson  = getFileIfExists(`${config.baseDir}/package.json`);

config.srcFiles     = [
    config.srcDir+'/**/*.js?(x)',
    '!'+config.srcDir+'/rikoconfig.js',
    '!'+config.srcDir+'/vendor/**/*.js',
    '!'+config.srcDir+'/__tests__utils/**/*.js'
];

const getRikoConfig = getFileIfExists(`${config.srcDir}/rikoconfig`);
const rikoConfig = getRikoConfig();

export default { rikoConfig, config };

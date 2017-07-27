//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************
import { getFileIfExists, getDefaultConfigFromRunCommand, genericLog } from './functions';
import { forEach, isEmpty, includes } from 'lodash';
import assert from 'assert';
const config  = {};

//Root Directory
config.baseDir      = process.cwd(); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir       = `${config.baseDir}/src`; //IMPORTANT! DO NOT OVERRIDE!

//Temporary Directory
config.tempDir      = `${config.baseDir}/temp`;

//Custom project Package.json
config.packageJson  = getFileIfExists(`${config.baseDir}/package.json`);

config.srcFiles     = [
    config.srcDir+'/**/*.js?(x)',
    '!'+config.srcDir+'/rikoconfig.js',
    '!'+config.srcDir+'/vendor/**/*.js',
    '!'+config.srcDir+'/__tests__utils/**/*.js'
];

//Relative Output Paths
config.audioOutputPath = 'assets/audio';
config.miscFileOutputPath = 'assets/files'; //pdf, docs, etc
config.fontOutputPath = 'assets/fonts';
config.imageOutputPath = 'assets/images';
config.videoOutputPath = 'assets/videos';

const customConfig  = getFileIfExists(`${config.srcDir}/rikoconfig`);
const defaultConfig = process.env.runCommand ? getDefaultConfigFromRunCommand(process.env.runCommand) : {};

//**********************************************************************
//******************************ASSERTIONS******************************
//**********************************************************************

genericLog('validating rikoconfig.js file..');

const requiredFields = {
    SERVER_PORT: 'number',
    entry: 'object',
    output: 'object'
};

//Validate Config Fields
forEach(defaultConfig, (value, key) => {
    //make sure default keys are present in rikoconfig
    assert.ok(key in customConfig, `config.${key} must be present in rikoconfig.js`);

    //handle require fields
    includes(requiredFields , key) ? assert.ok(!isEmpty(customConfig[key]), `config.${key} must not be empty rikoconfig.js`) : null;

    //make sure default keys are of valid type in rikoconfig
    assert.equal(typeof customConfig[key], typeof value, `config.${key}'s value must be of type '${typeof value}' in rikoconfig.js`);
});

genericLog('rikoconfig.js file is vaild!', 'green');

const newConfig = Object.assign(
    {},
    customConfig,
    config
);

export default newConfig;
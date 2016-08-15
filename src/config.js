module.exports = () => {
    "use strict";

    const config = {};

    //**********************************************************************
    //*******************************CORE***********************************
    //**********************************************************************

    config.moduleName               = 'riko';
    config.mainFileName             = 'index.html';
    config.nodePath                 = process.env.NODE_PATH;
    config.sitePrefix               = '';
    config.baseDir                  = process.cwd();
    config.srcDir                   = config.baseDir+'/src';
    config.destDir                  = config.baseDir+'/app';
    config.tempDir                  = config.baseDir+'/temp';
    config.jscsConfig               = config.baseDir+'/.jscsrc';

    config.EXPRESS_PORT             = 3000;
    config.EXPRESS_ROOT_DEV         = config.baseDir;
    config.EXPRESS_ROOT_PROD        = config.baseDir + '/app';

    return config;

};
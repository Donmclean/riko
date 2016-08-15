"use strict";
module.exports = () => {

    const baseDir = process.cwd(),

    //***************************************************************************
    //**********************************CORE*************************************
    //***************************************************************************

    config                          = require(baseDir+'/src/config')();

    config.vars                     = require(baseDir+'/gulp/variables')();
    config.packageJsonFile          = baseDir+'/package.json';
    config.taskDir                  = baseDir +'/gulp/tasks/';
    config.taskList                 = config.vars.fs.readdirSync(config.taskDir);
    config.gulpJSCSConfig           = baseDir+'/gulp/json_configs/.jscsrc';
    config.gulpESLINTConfig         = baseDir+'/gulp/json_configs/.eslintrc';

    config.gulpFile                 = config.baseDir+'/gulpfile.js'; //TODO: throw error is gulpfile not found
    config.gulpFiles                = [

        config.baseDir+'/gulpfile.js',
        config.baseDir+'/gulp/**/*.js'

    ];

    return config;
};
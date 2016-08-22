"use strict";
module.exports = (config) => {
    const indexConfig = {};

    indexConfig.template    = './src/templates/index.pug';
    indexConfig.inject      = "body";
    indexConfig.hash        = true;
    indexConfig.cache       = true; //default
    indexConfig.showErrors  = true; //default

    return indexConfig;

};
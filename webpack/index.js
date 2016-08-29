"use strict";
module.exports = (config) => {
    const indexConfig = {};

    indexConfig.template    = config.template_src_path;
    indexConfig.inject      = "body";
    indexConfig.hash        = true;
    indexConfig.cache       = true; //default
    indexConfig.showErrors  = true; //default

    return indexConfig;

};
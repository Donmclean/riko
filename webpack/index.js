"use strict";
module.exports = (config) => {
    const indexConfig = {};

    indexConfig.template    = config.template_src_path;
    indexConfig.favicon     = config.media_favicon_path;
    indexConfig.inject      = "body";
    indexConfig.hash        = true;
    indexConfig.cache       = true; //default
    indexConfig.showErrors  = true; //default
    indexConfig.scripts     = config.js_external_scripts;
    indexConfig.stylesheets = config.styles_external_stylesheets;

    return indexConfig;

};
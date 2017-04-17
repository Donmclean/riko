"use strict";
module.exports = (customConfig) => {
    const htmlWebpackPluginOptions = {};

    htmlWebpackPluginOptions.title       = customConfig.title;
    htmlWebpackPluginOptions.template    = customConfig.templateFile;
    htmlWebpackPluginOptions.favicon     = customConfig.faviconPath;
    htmlWebpackPluginOptions.inject      = "body";
    htmlWebpackPluginOptions.hash        = true;
    htmlWebpackPluginOptions.cache       = true; //default
    htmlWebpackPluginOptions.showErrors  = true; //default
    htmlWebpackPluginOptions.scripts     = customConfig.js_external_scripts;
    htmlWebpackPluginOptions.stylesheets = customConfig.styles_external_stylesheets;

    return {
        htmlWebpackPluginOptions
    };
};
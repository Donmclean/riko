"use strict";
module.exports = (customConfig) => {
    const htmlWebpackPluginOptions = {};

    htmlWebpackPluginOptions.template    = customConfig.template_src_path;
    htmlWebpackPluginOptions.favicon     = customConfig.faviconPath;
    htmlWebpackPluginOptions.inject      = "body";
    htmlWebpackPluginOptions.hash        = true;
    htmlWebpackPluginOptions.cache       = true; //default
    htmlWebpackPluginOptions.showErrors  = true; //default
    htmlWebpackPluginOptions.scripts     = customConfig.js_external_scripts;
    htmlWebpackPluginOptions.stylesheets = customConfig.styles_external_stylesheets;
    htmlWebpackPluginOptions.googleAnalyticsEnabled          = customConfig.gaEnable;
    htmlWebpackPluginOptions.googleAnalyticsTrackingId       = customConfig.gaTrackingId;
    htmlWebpackPluginOptions.googleAnalyticsPageViewOnLoad   = customConfig.gaPageViewOnLoad;

    return {
        htmlWebpackPluginOptions
    };
};
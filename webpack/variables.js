"use strict";
module.exports = () => {

    const vars = {};

    vars.path               = require('path');

    vars.webpack            = require('webpack');
    vars.chalk              = require('chalk');
    vars.ProgressBarPlugin  = require('progress-bar-webpack-plugin');
    vars.HtmlWebpackPlugin  = require('html-webpack-plugin');
    vars.BrowserSyncPlugin  = require('browser-sync-webpack-plugin');

    vars.express            = require('express');
    vars.app                = require('express')();
    vars.morgan             = require('morgan');

    vars.NODE_ENV           = process.argv[2] === "--prod" ? "production" : "development";

    return vars;
};
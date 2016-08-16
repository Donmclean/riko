"use strict";
module.exports = () => {

    const vars = {};

    vars.path               = require('path');

    vars.webpack            = require('webpack');
    vars.chalk              = require('chalk');
    vars.ProgressBarPlugin  = require('progress-bar-webpack-plugin');
    vars.HtmlWebpackPlugin  = require('html-webpack-plugin');

    vars.NODE_ENV           = process.argv[2] === "--prod" ? "production" : "development";

    return vars;
};
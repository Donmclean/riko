"use strict";
module.exports = () => {

    const vars = {};

    vars.http                   = require('http');
    vars.ipAddress              = require('ip').address();
    vars.path                   = require('path');

    vars.webpack                = require('webpack');
    vars.chalk                  = require('chalk');
    vars._                      = require('lodash');
    vars.qfs                    = require('q-io/fs');
    vars.fs                     = require('fs-extra');
    vars.exec                   = require('child_process').exec;

    try {
        vars.GIT_VERSION        = require('child_process').execSync('git rev-parse HEAD').toString().trim();
    } catch (err) {
        console.log("git is not initialized...", vars.chalk.red(err.cmd) + " FAILED!");
        vars.GIT_VERSION        = 'buildDetails';
    }

    vars.ProgressBarPlugin      = require('progress-bar-webpack-plugin');
    vars.HtmlWebpackPlugin      = require('html-webpack-plugin');
    vars.BrowserSyncPlugin      = require('browser-sync-webpack-plugin');
    vars.StyleLintPlugin        = require('stylelint-webpack-plugin');
    vars.ExtractTextPlugin      = require("extract-text-webpack-plugin");
    vars.Visualizer             = require('webpack-visualizer-plugin');
    vars.WebpackDevServer       = require('webpack-dev-server');
    vars.WebpackDevMiddleware   = require("webpack-dev-middleware");
    vars.WebpackHotMiddleware   = require("webpack-hot-middleware");
    vars.fallback               = require('express-history-api-fallback');
    vars.historyApiFallback     = require('connect-history-api-fallback');
    vars.ImageminPlugin         = require('imagemin-webpack-plugin').default;
    vars.WebpackShellPlugin     = require('webpack-shell-plugin');
    vars.CleanWebpackPlugin     = require('clean-webpack-plugin');
    vars.WebpackNotifierPlugin  = require('webpack-notifier');

    vars.autoprefixer           = require('autoprefixer');

    vars.express                = require('express');
    vars.app                    = require('express')();
    vars.morgan                 = require('morgan');
    vars.NODE_ENV               = process.env.NODE_ENV;

    return vars;
};
"use strict";
module.exports = () => {

    const vars = {};

    vars.http                   = require('http');
    vars.path                   = require('path');

    vars.webpack                = require('webpack');
    vars.chalk                  = require('chalk');
    vars._                      = require('lodash');
    vars.qfs                    = require('q-io/fs');
    vars.fs                     = require('fs-extra');
    vars.GIT_VERSION            = require('child_process').execSync('git rev-parse HEAD').toString().trim();

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
    vars.ImageminPlugin         = require('imagemin-webpack-plugin').default;
    vars.WebpackShellPlugin     = require('webpack-shell-plugin');

    vars.precss                 = require('precss');
    vars.autoprefixer           = require('autoprefixer');
    vars.cssModulesRequireHook  = require('css-modules-require-hook');

    vars.postcssImport          = require('postcss-import')({addDependencyTo: vars.webpack});

    vars.express                = require('express');
    vars.app                    = require('express')();
    vars.morgan                 = require('morgan');
    vars.karma                  = require('karma');
    vars.karmaServer            = vars.karma.Server;
    vars.NODE_ENV               = process.env.NODE_ENV;

    return vars;
};
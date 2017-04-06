/*eslint-disable*/
module.exports = () => {
    const vars = {};

    vars.argv                   = require('yargs');
    vars.$                      = require('gulp-load-plugins')();
    vars.cwd                    = process.cwd();
    vars.path                   = require('path');
    vars.baseDir                = vars.path.resolve(__dirname, '../');
    vars.srcDir                 = vars.baseDir + '/src';
    vars.http                   = require('http');
    vars.ipAddress              = require('ip').address();
    vars.webpack                = require('webpack');
    vars.chalk                  = require('chalk');
    vars._                      = require('lodash');
    vars.Q                      = require('q');
    vars.qfs                    = require('q-io/fs');
    vars.fs                     = require('fs-extra');
    vars.os                     = require('os');
    vars.exec                   = require('child_process').exec;
    vars.spawn                  = require('child_process').spawn;
    vars.spawnSync              = require('child_process').spawnSync;
    vars.chokidar               = require('chokidar');

    try {
        vars.GIT_VERSION        = require('child_process').execSync('git rev-parse HEAD').toString().trim();
        vars.GIT_VERSION_SHORT  = require('child_process').execSync('git rev-parse --short HEAD').toString().trim();
    } catch (err) {
        console.log("git is not initialized...", vars.chalk.red(err.cmd) + " FAILED!");
        vars.GIT_VERSION        = 'GIT_VERSION';
        vars.GIT_VERSION_SHORT  = 'UNKNOWN_GIT_VERSION_SHORT';
    }
    vars.BUILD_DATE             = new Date();

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
    vars.CopyWebpackPlugin      = require('copy-webpack-plugin');

    vars.autoprefixer           = require('autoprefixer');

    vars.express                = require('express');
    vars.app                    = require('express')();
    vars.morgan                 = require('morgan');
    vars.electronPackager       = require('electron-packager');
    vars.browserSync            = require('browser-sync');
    vars.nodemon                = require('nodemon');

    //NODE VARS
    vars.isMAC                  = (process.env._system_type === 'Darwin');

    return vars;
};
/*eslint-disable*/
module.exports = () => {
    const vars = {};

    //TODO: create a module for this
    //- hash map vars to {value: something, RequireType: '<string><options..>'}
    // const valueRetrievalOptions = {
    //     direct: (value) => value,
    //     require: (value) => require(value),
    //     requireCall: (value) => require(value)(),
    //     requireValueKey: (value, key) => require(value)[key],
    //     requireValueCall: (value) => require(value)[key]()
    // };

    vars.$                      = require('gulp-load-plugins')();
    vars.cwd                    = process.cwd();
    vars.path                   = require('path');
    vars.baseDir                = vars.path.resolve(__dirname, '../');
    vars.packageJson            = require('../package.json');
    vars.srcDir                 = vars.baseDir + '/src';
    vars.ipAddress              = require('ip').address();
    vars.webpack                = require('webpack');
    vars.chalk                  = require('chalk');
    vars._                      = require('lodash');
    vars.Q                      = require('q');
    vars.qfs                    = require('q-io/fs');
    vars.fs                     = require('fs');
    vars.os                     = require('os');
    vars.cp                     = require('child_process');
    vars.exec                   = vars.cp.exec;
    vars.execSync               = vars.cp.execSync;
    vars.spawn                  = vars.cp.spawn;
    vars.spawnSync              = vars.cp.spawnSync;
    vars.chokidar               = require('chokidar');
    vars.isGitInitialized       = vars.fs.readdirSync(vars.cwd).includes('.git') ? (vars.fs.readdirSync(`${vars.cwd}/.git/objects`).length > 2) : false;

    if(vars.isGitInitialized) {
        try {
            vars.GIT_SHA        = vars.cp.execSync('git rev-parse HEAD').toString().trim();
            vars.GIT_SHA_SHORT  = vars.cp.execSync('git rev-parse --short HEAD').toString().trim();
        } catch (err) {
            console.error('ERROR > [git rev-parse HEAD] Failed...', err);
        }
    } else {
        vars.GIT_SHA        = 'GIT_SHA';
        vars.GIT_SHA_SHORT  = 'UNKNOWN_GIT_SHA_SHORT';
    }

    vars.ProgressBarPlugin      = require('progress-bar-webpack-plugin');
    vars.HtmlWebpackPlugin      = require('html-webpack-plugin');
    vars.BrowserSyncPlugin      = require('browser-sync-webpack-plugin');
    vars.StyleLintPlugin        = require('stylelint-webpack-plugin');
    vars.ExtractTextPlugin      = require("extract-text-webpack-plugin");
    vars.Visualizer             = require('webpack-visualizer-plugin');
    vars.WebpackDevServer       = require('webpack-dev-server');
    vars.fallback               = require('express-history-api-fallback');
    vars.ImageminPlugin         = require('imagemin-webpack-plugin').default;
    vars.WebpackShellPlugin     = require('webpack-shell-plugin');
    vars.CleanWebpackPlugin     = require('clean-webpack-plugin');
    vars.WebpackNotifierPlugin  = require('webpack-notifier');
    vars.CopyWebpackPlugin      = require('copy-webpack-plugin');
    vars.BundleAnalyzerPlugin   = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

    vars.autoprefixer           = require('autoprefixer');

    vars.express                = require('express');
    vars.app                    = require('express')();
    vars.morgan                 = require('morgan');
    vars.electronPackager       = require('electron-packager');
    vars.browserSync            = require('browser-sync');
    vars.nodemon                = require('nodemon');
    vars.inquirer               = require('inquirer');

    return vars;
};
/*eslint-disable*/
module.exports = () => {
    const vars = {};

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
    vars.immutable              = require('immutable');
    vars.Q                      = require('q');
    vars.qfs                    = require('q-io/fs');
    vars.fs                     = require('fs');
    vars.assert                 = require('assert');
    vars.os                     = require('os');
    vars.cp                     = require('child_process');
    vars.exec                   = vars.cp.exec;
    vars.execSync               = vars.cp.execSync;
    vars.spawn                  = require('cross-spawn');
    vars.spawnSync              = vars.spawn.sync;
    vars.shell                  = require('shelljs');
    vars.chokidar               = require('chokidar');

    vars.WebpackDevServer       = require('webpack-dev-server');
    vars.merge                  = require('webpack-merge');
    vars.autoprefixer           = require('autoprefixer');

    vars.express                = require('express');
    vars.app                    = require('express')();
    vars.fallback               = require('express-history-api-fallback');
    vars.morgan                 = require('morgan');
    vars.electronPackager       = require('electron-packager');
    vars.browserSync            = require('browser-sync');
    vars.nodemon                = require('nodemon');
    vars.inquirer               = require('inquirer');

    return vars;
};
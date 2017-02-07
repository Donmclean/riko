const vars = {};

vars.argv       = require('yargs');
vars.qfs        = require('q-io/fs');
vars.path       = require('path');
vars._          = require('lodash');
vars.$          = require('gulp-load-plugins')();
vars.spawn      = require('child_process').spawn;
vars.cwd        = process.cwd();
vars.baseDir    = vars.path.resolve(__dirname);

module.exports = vars;
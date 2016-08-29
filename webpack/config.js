const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

config.vars                     = require('./variables')();

config.moduleName               = 'riko';
config.nodePath                 = process.env.NODE_PATH;
config.sitePrefix               = '';
config.baseDir                  = process.cwd();
config.destDir                  = config.baseDir+"/app";

config.EXPRESS_PORT             = 3000;
config.EXPRESS_ROOT             = config.destDir || config.baseDir + '/app';

config.jscsConfig               = config.baseDir+'/.jscsrc';
config.eslintConfig             = config.baseDir+'/.eslintrc';
config.stylelintConfig          = config.baseDir+'/.stylelintrc.yaml';
config.karmaConfig              = config.baseDir+'/karma.conf.js';
config.nightWatchConfig         = config.baseDir+'/nightwatch.json';


//**********************************************************************
//********************************JS************************************
//**********************************************************************

config.js_main_file_name        = config.moduleName+'.js';
config.js_main_entry_path       = config.baseDir+'/src/js/'+config.js_main_file_name;


//**********************************************************************
//*******************************STYLES*********************************
//**********************************************************************
config.styles_main_file_name    = 'styles.min.css';

//**********************************************************************
//******************************TEMPLATE********************************
//**********************************************************************
config.template_main_file_name  = 'index.html';
config.template_stats_file_name = 'stats.html';
config.template_src_path        = config.baseDir+'/src/templates/index.pug';

//**********************************************************************
//*******************************TESTS**********************************
//**********************************************************************

// See karma.conf.js file

module.exports = config;
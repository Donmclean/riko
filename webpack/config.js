const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

config.vars                     = require('./variables')();

config.moduleName               = 'riko';
config.mainIndexName            = 'index.html';
config.nodePath                 = process.env.NODE_PATH;
config.sitePrefix               = '';
config.baseDir                  = process.cwd();
config.destDir                  = config.baseDir+"/app";
config.jscsConfig               = config.baseDir+'/.jscsrc';
config.eslintConfig             = config.baseDir+'/.eslintrc';

config.EXPRESS_PORT             = 3000;
config.EXPRESS_ROOT             = config.destDir || config.baseDir + '/app';


//**********************************************************************
//********************************JS************************************
//**********************************************************************
config.js                       = {};

config.js_main_entry            = [
    config.baseDir+'/src/js/riko.jsx'
];
config.js_main_name             = config.moduleName+'.js';
config.js.mainFileName          = config.moduleName+'.jsx';

config.js.webSrcs               = [];


//**********************************************************************
//********************************SASS**********************************
//**********************************************************************
config.sass_main                = config.baseDir+'/src/sass';

//**********************************************************************
//********************************CSS***********************************
//**********************************************************************
config.css                      = {};
config.css_main                 = config.baseDir+'/src/css/custom-css.css';

//**********************************************************************
//******************************TEMPLATE********************************
//**********************************************************************
config.template_main            = config.baseDir+'/src/template/index.pug';

//**********************************************************************
//*******************************TESTS**********************************
//**********************************************************************


config.tests                    = {};
config.tests.changed            = [];
config.tests.all                = config.baseDir+'/tests/**/*.js';
config.tests.unit               = [

    config.baseDir+'/tests/unit/**/*.js'

];
config.tests.extras             = [

    config.baseDir+'/bin/polyfills/bind-polyfill.js'
];
config.karmaConfigFile          = config.baseDir+'/karma.conf.js';
config.tests.selenium           = config.baseDir+'/tests/selenium/**/*.js';
config.tests.nightWatchConfig   = config.baseDir+'/nightwatch.json';

module.exports = config;
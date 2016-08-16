const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

config.moduleName               = 'riko';
config.mainIndexName            = 'index.html';
config.mainIndexName            = 'index.html';
config.nodePath                 = process.env.NODE_PATH;
config.sitePrefix               = '';
config.baseDir                  = process.cwd();
config.destDir                  = config.baseDir+"/app";
config.jscsConfig               = config.baseDir+'/.jscsrc';
config.eslintConfig             = config.baseDir+'/.eslintrc';

config.EXPRESS_PORT             = 3000;


//**********************************************************************
//********************************JS************************************
//**********************************************************************
config.js                       = {};

config.js_main_entry            = config.baseDir+'/src/js/riko.jsx';
config.js_main_name             = 'riko.js';
config.js.mainFileName          = config.moduleName+'.jsx';

config.js.webSrcs               = [];


//**********************************************************************
//********************************SASS**********************************
//**********************************************************************
config.sass                     = {};

//**********************************************************************
//********************************CSS***********************************
//**********************************************************************
config.css                      = {};

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
config.tests.selenium           = config.baseDir+'/tests/selenium/**/*.js';
config.tests.nightWatchConfig   = config.baseDir+'/nightwatch.json';

module.exports = config;
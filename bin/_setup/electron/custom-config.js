const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

const path                      = require('path');

//Root Directory
const baseDir                   = path.resolve(__dirname, '../'); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir                   = baseDir+"/src"; //IMPORTANT! DO NOT OVERRIDE!

//**********************************************************************
//******************************CUSTOM**********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'baseDir' unless specified otherwise.
// eg: baseDir+'/path'

config.moduleName               = 'riko';
config.destDir                  = baseDir+"/dist";
config.tempDir                  = baseDir+"/temp";

config.EXPRESS_PORT             = 3000;
config.EXPRESS_ROOT             = config.destDir;

config.eslintConfig             = config.srcDir+'/__linters/.eslintrc';
config.stylelintConfig          = config.srcDir+'/__linters/.stylelintrc.yaml';
config.packageJson              = baseDir+'/package.json';

config.srcFiles                 = [
    config.srcDir+'/**/*.js?(x)',
    '!'+config.srcDir+'/custom-config.js',
    '!'+config.srcDir+'/vendor/**/*.js',
    '!'+config.srcDir+'/__tests__utils/**/*.js'
];

//**********************************************************************
//*******************************PACKAGER*******************************
//**********************************************************************
//for Electron Applications Only
config.electronPackagingOptions             = {};

//Source directory for your electron source code
config.electronPackagingOptions.dir         = config.tempDir;

//target system architecture(s)
config.electronPackagingOptions.arch        = 'x64';

//applications icon  //OS X: .icns  //Windows: .ico
//get free conversions herehttps://iconverticons.com/online/
config.electronPackagingOptions.icon        = config.srcDir+'/riko-logo.icns';

//The application name
config.electronPackagingOptions.name        = 'Riko';

//target platform(s) to build for
config.electronPackagingOptions.platform    = ['darwin','win32'];

//disable pruning
config.electronPackagingOptions.prune       = false; //THIS MUST BE FALSE!!! BREAKS IF TRUE.

//Enable or disable asar archiving
config.electronPackagingOptions.asar        = true;

//directory where the finished package(s) are created
config.electronPackagingOptions.out         = config.destDir;

//**********************************************************************
//********************************JS************************************
//**********************************************************************

config.js_main_file_name        = config.moduleName+'.js';
config.js_main_entry_path       = config.srcDir+'/js/'+config.js_main_file_name;
config.js_output_path           = 'assets/js';

config.js_external_scripts      = [
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
        async: false,
        defer: false
    },
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js',
        async: false,
        defer: false
    },
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.js',
        async: true,
        defer: false
    }
];

//IMPORTANT!!! ALL VALUES OF THE FOLLOWING 'value' key *MUST BE JSON STRINGIFIED*
config.js_runtime_configs      = [
    {
        key: 'process.env',
        value: {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }
];

//**********************************************************************
//*******************************STYLES*********************************
//**********************************************************************
config.styles_main_file_name    = 'styles.min.css';

config.styles_external_stylesheets  = [
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];

//**********************************************************************
//******************************TEMPLATE********************************
//**********************************************************************
//IMPORTANT!!! this should only be enabled if building an html web app
//disable this if creating a non-html based project
config.requiresTemplate         = true;

config.template_main_file_name  = 'index.html';
config.template_stats_file_name = '';
config.template_src_path        = config.srcDir+'/templates/index.pug';

//if you're using a custom template engine 'OTHER THAN' pug or html
//add as string below.
//https://www.npmjs.com/package/template-html-loader
//https://github.com/tj/consolidate.js
config.template_engine          = ''; //eg: hbs, handlebars, ejs, mustache

//Google Analytics
config.gaEnable                 = true;
config.gaTrackingId             = 'UA-XXXXX-Y';
config.gaPageViewOnLoad         = true;

//**********************************************************************
//********************************MEDIA*********************************
//**********************************************************************

// IMPORTANT!!! (THESE ARE ALREADY RELATIVE TO OUTPUT OR DESTINATION)
// ALSO DO NOT ADD TRAILING SLASH '/' eg: assets/audio/

config.media_audio_output_path  = 'assets/audio';
config.media_files_output_path  = 'assets/files'; //pdfs, docs, etc
config.media_fonts_output_path  = 'assets/fonts';
config.media_images_output_path = 'assets/images';
config.media_video_output_path  = 'assets/video';

// IMPORTANT!!! Use absolute path here.
config.media_favicon_path       = config.srcDir+'/media/images/riko-favicon.png';

//Image optimization options
//See: https://github.com/Klathmon/imagemin-webpack-plugin
config.imageminConfig = {
    // progressive: true,
    pngquant:{
        quality: '65-90',
        speed: 4
    },
    svgo:{
        plugins: [
            {
                removeViewBox: false
            },
            {
                removeEmptyAttrs: false
            }
        ]
    }
};

//**********************************************************************
//*******************************VENDOR*********************************
//**********************************************************************

//IMPORTANT!!! all module dependencies that are NOT npm installed modules
// -  eg: require('src/vendor/jquery.min.js')
// must be specified with it's valid ABSOLUTE path here
config.externalModulePaths = {
    //eg: $ : 'src/vendor/jquery.min.js'
};

// add vendor dependencies that you wish to expose globally but not expose
// to global/window object here.
//
// If using an npm module. Use the same way as you would in a require statement.
// eg: _ : 'lodash'
//
// But if using a vendor dependency. Use the MATCHING KEY from config.externalModulePaths
// IMPORTANT!!! DO NOT USE AN ABSOLUTE PATH.
//
// eg:  config.externalModulePaths  = {$ : 'src/vendor/jquery.min.js'};
//      config.externalModules      = {$: '$'};
// Notice how the '$' value of externalModules matches the key $ of externalModulePaths
config.externalModules = {
    //eg: $ : 'jquery'
    //or: $ : '$' //if you're not using the npm module. Make sure path is mapped in config.externalModulePaths
};

// To add vendor dependencies and expose them to global/window object simply use the expose-loader
// eg: require("expose-loader?_!lodash");
// see: https://github.com/webpack/expose-loader

//**********************************************************************
//*******************************TESTS**********************************
//**********************************************************************

// See Readme

//**********************************************************************
//*******************************EXTRAS*********************************
//**********************************************************************

//https://webpack.github.io/docs/configuration.html#devtool
config.sourcemapType = 'source-map';

//Enable of disable sourcemaps
config.sourcemapDev = true;
config.sourcemapProd = true;

//Enable remote debugging via vorlon.js very useful for debugging on mobile devices.
//Simply visit localhost:1337 or browsersync's [externalIp]:1337 in dev mode (npm run dev)
//See: http://vorlonjs.com/
//WARNING: js sourcemap info will not be able in browser console if enabled in dev mode
//IMPORTANT! this is only recommend if you're debugging a specific device or not using sourcemaps.
config.enableRemoteDebugging   = false;


config.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix all

config.hotReloadingOptions     = {
    overlay: true,
    reload: true,
    noInfo: false,
    quiet: false
};

//Override hot module replacement and simply have the page refresh on file change
config.BrowserSyncReloadOnChange = false;

//Enable this to have tests execute on every webpack rebuild.
config.hotExecuteTests = false;

// IMPORTANT! must be and array. eg: [ 'echo hello world' ];
config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];

config.failOnProdBuildJsError = true;
config.failOnProdBuildStyleError = false;
config.eslintQuietMode = false; //set false to display warnings based on your eslint config

//enable webpack visualizer which allows you to see the build product of your js sources & dependencies via current git SHA as url
config.enableWebpackVisualizer = true;

module.exports = config;
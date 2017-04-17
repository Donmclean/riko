//**********************************************************************
//*******************************PATHS**********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'BASE DIRECTORY' unless specified otherwise.
//BASE DIRECTORY is same location as package.json file.
const config = {};

config.title                    = 'riko';

config.destDir                  = 'dist';
config.tempDir                  = 'temp';
config.eslintConfig             = '.eslintrc.js';
config.stylelintConfig          = 'stylelint.config.js';
config.nightwatchConfig         = 'nightwatchconfig.js';

config.faviconPath              = 'src/media/images/riko-favicon.png';
config.entryFile                = 'src/js/riko.js';
config.templateFile             = 'src/templates/index.pug';

// IMPORTANT!!! (THESE PATHS SHOULD BE RELATIVE TO OUTPUT OR DESTINATION DIRECTORY)
// ALSO DO NOT ADD LEADING/TRAILING SLASHES '/'
// eg: /assets/audio NOR eg: assets/audio/

config.js_output_path           = 'assets/js';
config.media_audio_output_path  = 'assets/audio';
config.media_files_output_path  = 'assets/files'; //pdfs, docs, etc
config.media_fonts_output_path  = 'assets/fonts';
config.media_images_output_path = 'assets/images';
config.media_video_output_path  = 'assets/video';

config.styles_main_file_name    = 'styles.min.css';

config.template_main_file_name  = 'index.html';
config.template_stats_file_name = '';

config.EXPRESS_PORT             = 3000;

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

config.styles_external_stylesheets  = [
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];

//**********************************************************************
//******************************TEMPLATE********************************
//**********************************************************************
//IMPORTANT!!! this should only be enabled if building an html web app
//disable this if creating a non-html based project
config.requiresTemplate         = true;

//**********************************************************************
//********************************MEDIA*********************************
//**********************************************************************

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

// provide browserstack account info here to for selenium testing to work
// https://www.browserstack.com/accounts/settings
// see readme for more details
config.browserstackUsername = 'browserstackuser';
config.browserstackAccessKey = 'browserstackkey';

//Provide an npm package.json script command here to have tests execute on every webpack rebuild.
//i.e: 'test' would execute as 'npm run test' or 'hot-test' as 'npm run hot-test'
config.hotExecuteTestCommand = 'test';

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
    overlay: true
};

//Override hot module replacement and simply have the page refresh on file change
config.BrowserSyncReloadOnChange = false;

// IMPORTANT! must be and array. eg: [ 'echo hello world' ];
config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];

config.failOnProdBuildJsError = true;
config.failOnProdBuildStyleError = false;
config.eslintQuietMode = false; //set false to display warnings based on your eslint config

//enable webpack visualizer which allows you to see the build product of your js sources & dependencies via current git SHA as url
config.enableWebpackVisualizer = true;

//specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
//must be an absolute path.
config.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = config;
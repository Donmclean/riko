//**********************************************************************
//*******************************PATHS**********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'BASE DIRECTORY' unless specified otherwise.
//BASE DIRECTORY is same location as package.json file.
const config = {};

config.title                    = 'Riko';

config.destDir                  = 'dist';
config.tempDir                  = 'temp';

config.entryFile                = 'src/js/riko.js';
config.templateFile             = 'src/templates/index.pug';

config.cssOutputFilename        = 'styles.min.css';

config.EXPRESS_PORT             = 3000;

//**********************************************************************
//*******************************ELECTRON*******************************
//**********************************************************************
//for Electron Applications Only
//See API for all options here: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
config.electronPackagerOptions  = {
    //applications icon  //OS X: .icns  //Windows: .ico
    //get free conversions herehttps://iconverticons.com/online/
    icon: 'src/riko-logo.icns',

    //target platform(s) to build for
    platform: ['darwin','win32'],

    //Enable or disable asar archiving
    asar: true
};

//**********************************************************************
//****************************EXTERNALS*********************************
//**********************************************************************
config.externalScripts      = [
    // example
    // {
    //     src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
    //     async: false,
    //     defer: false
    // }
];

config.externalStylesheets  = [
    // 'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];

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
//*************************LOADER OPTIONS*******************************
//**********************************************************************
//You can utilize 'process.env.NODE_ENV' here to specific options based on your NODE_ENV
config.eslintLoaderOptions = {
    configFile: '.eslintrc.js',
    failOnError: process.env.NODE_ENV === 'production',
    failOnWarning: false,
    emitError: process.env.NODE_ENV === 'development',
    quiet: false //set true to disable warnings based on your eslint config
};

//**********************************************************************
//*************************PLUGIN OPTIONS*******************************
//**********************************************************************
config.htmlWebpackPluginOptions = {
    favicon: 'src/media/images/riko-favicon.png',
    inject: 'body',
    hash: true,
    cache: true, //default
    showErrors: true, //default
};

config.styleLintPluginOptions = {
    configFile: 'stylelint.config.js',
    files: [
        '**/*.s?(a|c)ss',
        '**/*.styl',
        '**/*.less',
        '**/*.css',
        '!(vendor)**/*.css'
    ],
    failOnError: false
};

//Image optimization options
//See: https://github.com/Klathmon/imagemin-webpack-plugin
config.imageminPluginOptions = {
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

config.uglifyJsPluginOptions = {};

//IMPORTANT!!! ALL VALUES OF THE FOLLOWING 'value' key *MUST BE JSON STRINGIFIED*
config.definePluginOptions = {};

//**********************************************************************
//*******************************EXTRAS*********************************
//**********************************************************************
config.hotReloadingOptions     = {
    overlay: true,

    //Override hot module replacement and simply have the page refresh on file change
    BrowserSyncReloadOnChange: false,

    //Provide an npm package.json script command here to have tests execute on every webpack rebuild.
    //i.e: 'test' would execute as 'npm run test' or 'hot-test' as 'npm run hot-test'
    hotExecuteTestCommand: 'test'
};

//https://webpack.github.io/docs/configuration.html#devtool
config.sourcemapType = 'source-map';

//Enable of disable sourcemaps
config.sourcemapDev = true;
config.sourcemapProd = true;

config.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix everything: browsers: ['> 0%']

// IMPORTANT! must be and array. eg: [ 'echo hello world' ];
config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];

//enable webpack visualizers which allows you to see the build product of your js sources & dependencies via current git SHA as url
//GIT_SHA.html || report-GIT_SHA.html
config.enableWebpackVisualizers = true;

//specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
//must be an absolute path.
config.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = config;
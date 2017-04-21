const defaultConfig = {};

defaultConfig.title = 'Riko';

defaultConfig.destDir = 'dist';
defaultConfig.tempDir = 'temp';

defaultConfig.entryFile = 'src/js/riko.js';
defaultConfig.templateFile = 'src/templates/index.pug';

defaultConfig.cssOutputFilename = 'styles.min.css';

defaultConfig.EXPRESS_PORT = 3000;

defaultConfig.electronPackagerOptions = {
    icon: 'src/riko-logo.icns',
    platform: ['darwin','win32'],
    asar: true
};

defaultConfig.externalScripts = [
    // example
    // {
    //     src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
    //     async: false,
    //     defer: false
    // }
];

defaultConfig.externalStylesheets = [
    // 'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];

defaultConfig.externalModulePaths = {
    //eg: $ : 'src/vendor/jquery.min.js'
};

defaultConfig.externalModules = {
    //eg: $ : 'jquery'
    //or: $ : '$' //if you're not using the npm module. Make sure path is mapped in config.externalModulePaths
};

defaultConfig.eslintLoaderOptions = {
    configFile: '.eslintrc.js',
    failOnError: process.env.NODE_ENV === 'production',
    failOnWarning: false,
    emitError: process.env.NODE_ENV === 'development',
    quiet: false //set true to disable warnings based on your eslint config
};

defaultConfig.htmlWebpackPluginOptions = {
    favicon: 'src/media/images/riko-favicon.png',
    inject: 'body',
    hash: true,
    cache: true, //default
    showErrors: true, //default
};

defaultConfig.styleLintPluginOptions = {
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

defaultConfig.imageminPluginOptions = {
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

defaultConfig.uglifyJsPluginOptions = {};

defaultConfig.definePluginOptions = {};

defaultConfig.hotReloadingOptions = {
    overlay: true,

    BrowserSyncReloadOnChange: false,

    hotExecuteTestCommand: 'test'
};

defaultConfig.sourcemapType = 'source-map';

defaultConfig.sourcemapDev = true;
defaultConfig.sourcemapProd = true;

defaultConfig.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix everything: browsers: ['> 0%']

defaultConfig.onBuildStartShellCommands = [];
defaultConfig.onBuildEndShellCommands = [];
defaultConfig.onBuildExitShellCommands = [];

defaultConfig.enableWebpackVisualizers = true;

defaultConfig.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = defaultConfig;
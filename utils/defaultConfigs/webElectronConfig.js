const config = {};

config.title = 'Riko';

config.destDir = 'dist';
config.tempDir = 'temp';

config.entryFile = 'src/js/riko.js';

config.EXPRESS_PORT = 3000;

config.electronPackagerOptions = {
    icon: 'src/riko-logo.icns',
    platform: ['darwin','win32'],
    asar: true
};

config.externalScripts = [
    // example
    // {
    //     src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
    //     async: false,
    //     defer: false
    // }
];

config.externalStylesheets = [
    // 'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];

config.externalModulePaths = {
    //eg: $ : 'src/vendor/jquery.min.js'
};

config.externalModules = {
    //eg: $ : 'jquery'
    //or: $ : '$' //if you're not using the npm module. Make sure path is mapped in config.externalModulePaths
};

config.eslintLoaderOptions = {
    configFile: '.eslintrc.js',
    failOnError: process.env.NODE_ENV === 'production',
    failOnWarning: false,
    emitError: process.env.NODE_ENV === 'development',
    quiet: false //set true to disable warnings based on your eslint config
};

config.setPlugins = (env, plugins) => {
    const { webpack, HtmlWebpackPlugin, ProgressBarPlugin, ExtractTextPlugin } = plugins;
    switch (env) {
        case 'global': {
            return [
                new HtmlWebpackPlugin({
                    title: 'Riko',

                    template: 'src/templates/index.pug',
                    favicon: 'src/media/images/riko-favicon.png',
                    inject: 'body',
                    hash: true,
                    cache: true, //default
                    showErrors: true, //default

                    scripts: [],
                    stylesheets: []
                }),
                new webpack.EnvironmentPlugin([
                    "NODE_ENV"
                ]),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                    }
                }),
                new ProgressBarPlugin({
                    format: 'webpack [:bar] ' + ':percent' + ' (:elapsed seconds)',
                    clear: true
                })
            ];
        }
        case 'prod': {
            return [
                new webpack.optimize.UglifyJsPlugin({
                    mangle: false,
                    sourceMap: true
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'index',
                    filename: 'assets/js/[name].js?[hash]'
                }),
                new webpack.ProvidePlugin({}),
                new ExtractTextPlugin({
                    filename: 'assets/css/styles.min.css?[hash]',
                    allChunks: true
                }),
            ];
        }
        case 'dev': {
            return [
                new webpack.ProvidePlugin({})
            ];
        }
        default: {
            return [];
        }
    }
};

config.hotReloadingOptions = {
    overlay: true,

    BrowserSyncReloadOnChange: false,

    hotExecuteTestCommand: 'test'
};

config.sourcemapType = 'source-map';

config.sourcemapDev = true;
config.sourcemapProd = true;

config.autoprefixerOptions = { browsers: ['> 0%'] }; //prefix everything: browsers: ['> 0%']

config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];

config.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = config;
const config = {
    entry: {
        index: [ './src/js/index.js' ]
    },
    output: {
        path: 'dist'
    }
};

config.setWebpackConfigOptions = (env, config, webpack, immutable) => {
    switch (env) {
        case 'global': {
            return config;
        }
        case 'production': {
            return config;
        }
        case 'development': {
            return config;
        }
        default: {
            return config;
        }
    }
};

config.electronPackagerOptions = {
    icon: 'src/riko-logo.icns',
    platform: 'all',
    asar: true
};

config.EXPRESS_PORT = 3000;

config.hotReloadingOptions = {
    overlay: true,

    BrowserSyncReloadOnChange: false,

    hotExecuteTestCommand: 'test',

    hotExecuteFlowTypeCommand: 'default'
};

config.sourcemapType = 'source-map';

config.sourcemapDev = true;
config.sourcemapProd = true;

config.autoprefixerOptions = { browsers: ['> 0%'] }; //prefix everything: browsers: ['> 0%']

config.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = config;
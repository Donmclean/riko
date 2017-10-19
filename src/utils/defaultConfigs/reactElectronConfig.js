export default {
    SERVER_PORT: 3000,

    setEntry: (newEntryObject, mainEntryList, immutable) => {
        mainEntryList.push('./src/js/index.js');

        newEntryObject.set('index', mainEntryList);

        return newEntryObject;
    },

    output: {
        path: 'dist'
    },

    devtool: 'source-map',

    setWebpackConfigOptions: (env, config) => {
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
    },

    electronPackagerOptions: {
        icon: 'src/riko-logo.icns',
        platform: 'all',
        asar: true
    },

    hotReloadingOptions: {
        overlay: true,

        browserSyncReloadOnChange: false,

        hotExecuteTestCommand: 'test',

        hotExecuteFlowTypeCommand: 'default'
    },

    //prefix everything: browsers: ['> 0%']
    autoprefixerOptions: {
        browsers: ['> 0%']
    },

    customBoilerplatePath: 'src/riko-custom-boilerplates'
};